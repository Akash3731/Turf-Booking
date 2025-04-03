const Booking = require("../models/Booking");
const Turf = require("../models/Turf");
const Razorpay = require("razorpay");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { amount, booking: bookingId, currency, receipt, notes } = req.body;

    // Verify the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Fetch the turf to get payment preference
    const turf = await Turf.findById(booking.turf);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    console.log("Creating order for booking:", bookingId);
    console.log("Turf details:", {
      id: turf._id,
      name: turf.name,
      razorpayAccountId: turf.razorpayAccountId || "Not set",
    });

    // Prepare order options
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || "INR",
      receipt,
      notes: {
        ...notes,
        bookingId: bookingId.toString(),
      },
    };

    // If turf has a Razorpay account ID, set up direct transfer
    if (turf.razorpayAccountId) {
      console.log(
        "Setting up direct transfer to account:",
        turf.razorpayAccountId
      );

      // Configure transfers for direct payment to turf owner
      orderOptions.transfers = [
        {
          account: turf.razorpayAccountId,
          amount: Math.round(amount * 100), // Send full amount to turf owner
          currency: currency || "INR",
          notes: {
            booking_id: bookingId.toString(),
            turf_name: turf.name,
          },
          on_hold: false,
        },
      ];
    }

    // Create Razorpay order with transfers if configured
    const order = await razorpay.orders.create(orderOptions);
    console.log("Order created:", order.id);

    if (orderOptions.transfers) {
      console.log("Order created with transfers configuration");
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment order",
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    console.log(
      "Verifying payment:",
      razorpay_payment_id,
      "for booking:",
      bookingId
    );

    // Verify signature
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Fetch booking and turf details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const turf = await Turf.findById(booking.turf);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // Get payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log("Payment details:", {
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      hasTransfers: !!payment.transfers,
    });

    // Check if payment already has transfers (from order creation)
    if (payment.transfers) {
      console.log("Payment already has transfers:", payment.transfers);
    }
    // If the turf has an account ID and payment doesn't have transfers yet, transfer the funds manually
    else if (turf.razorpayAccountId) {
      try {
        console.log(
          "Executing manual transfer to account:",
          turf.razorpayAccountId
        );

        // Transfer to turf owner's account
        const transferResult = await razorpay.transfers.create({
          account: turf.razorpayAccountId,
          amount: payment.amount,
          currency: payment.currency,
          notes: {
            booking_id: bookingId,
            turf_name: turf.name,
            payment_id: razorpay_payment_id,
          },
        });

        console.log("Manual transfer successful:", transferResult.id);
      } catch (transferError) {
        console.error("Transfer to account failed:", transferError);
        // Don't fail the booking, but log the error
      }
    }

    // Update booking status
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.paymentDetails = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      transferredDirectly: !!payment.transfers || !!turf.razorpayAccountId,
    };
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.id);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment details",
      error: error.message,
    });
  }
};

// @desc    Get all transfers for a payment
// @route   GET /api/payments/:id/transfers
// @access  Private
exports.getPaymentTransfers = async (req, res) => {
  try {
    // Use the all method with payment_id filter
    const transfers = await razorpay.transfers.all({
      payment_id: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transfers",
      error: error.message,
    });
  }
};

// @desc    Create a direct transfer (manual transfer)
// @route   POST /api/payments/transfer
// @access  Private (Admin)
exports.createTransfer = async (req, res) => {
  try {
    const { account, amount, currency, notes } = req.body;

    if (!account || !amount) {
      return res.status(400).json({
        success: false,
        message: "Account ID and amount are required",
      });
    }

    const transferOptions = {
      account,
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || "INR",
      notes: notes || {},
    };

    const transfer = await razorpay.transfers.create(transferOptions);

    res.status(201).json({
      success: true,
      message: "Transfer created successfully",
      data: transfer,
    });
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(500).json({
      success: false,
      message: "Error creating transfer",
      error: error.message,
    });
  }
};

// @desc    Get transfer details
// @route   GET /api/payments/transfers/:id
// @access  Private
exports.getTransferDetails = async (req, res) => {
  try {
    const transfer = await razorpay.transfers.fetch(req.params.id);

    res.status(200).json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    console.error("Error fetching transfer details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transfer details",
      error: error.message,
    });
  }
};

// @desc    Get all transfers
// @route   GET /api/payments/transfers
// @access  Private (Admin)
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await razorpay.transfers.all();

    res.status(200).json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    console.error("Error fetching all transfers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all transfers",
      error: error.message,
    });
  }
};
