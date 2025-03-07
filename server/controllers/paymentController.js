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

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes: {
        ...notes,
        bookingId: bookingId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment order",
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

    // If the turf has a merchant ID, transfer the funds immediately
    if (turf.razorpayMerchantId) {
      try {
        // Transfer to turf owner's account
        await razorpay.transfers.create({
          account: turf.razorpayMerchantId,
          amount: payment.amount,
          currency: payment.currency,
          notes: {
            booking_id: bookingId,
            turf_name: turf.name,
            payment_id: razorpay_payment_id,
          },
        });
      } catch (transferError) {
        console.error("Transfer to merchant failed:", transferError);
        // Don't fail the booking, but log the error
        // You might want to handle this situation differently
      }
    }

    // Update booking status
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.paymentDetails = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
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
    });
  }
};
