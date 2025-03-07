const Turf = require("../models/Turf");
const Booking = require("../models/Booking");

// @desc    Get all turfs
// @route   GET /api/turfs
// @access  Public
exports.getTurfs = async (req, res) => {
  try {
    // Build query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    let query = Turf.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Turf.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const turfs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: turfs.length,
      pagination,
      data: turfs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single turf
// @route   GET /api/turfs/:id
// @access  Public
exports.getTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    res.status(200).json({
      success: true,
      data: turf,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new turf
// @route   POST /api/turfs
// @access  Private/Admin
exports.createTurf = async (req, res) => {
  try {
    // Validate Razorpay Merchant ID
    if (!req.body.razorpayMerchantId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay Merchant ID is required",
      });
    }

    // Transform the price field into the expected pricing structure
    const turfData = {
      ...req.body,
      pricing: {
        pricePerHour: req.body.price,
        currency: "INR",
      },
    };

    // Create turf with transformed data
    const turf = await Turf.create(turfData);

    res.status(201).json({
      success: true,
      data: turf,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update turf
// @route   PUT /api/turfs/:id
// @access  Private/Admin
exports.updateTurf = async (req, res) => {
  try {
    // Find existing turf
    let turf = await Turf.findById(req.params.id);

    // Check if turf exists
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle pricing restructuring
    if (req.body.price) {
      updateData.pricing = {
        pricePerHour: req.body.price,
        currency: "INR",
      };
      delete updateData.price;
    }

    // Validate Razorpay Bank Account ID if provided
    if (req.body.razorpayBankAccountId) {
      try {
        // Optional: Verify bank account with Razorpay
        const bankAccount = await razorpay.fundAccounts.fetch(
          req.body.razorpayBankAccountId
        );

        // Additional validation
        if (!bankAccount || bankAccount.status !== "active") {
          return res.status(400).json({
            success: false,
            message: "Invalid or inactive Razorpay Bank Account",
          });
        }
      } catch (razorpayError) {
        return res.status(400).json({
          success: false,
          message: "Failed to verify Razorpay Bank Account",
          error: razorpayError.message,
        });
      }
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);

      // Combine or replace existing images
      if (req.body.keepExistingImages === "true") {
        updateData.images = [...turf.images, ...newImages];
      } else {
        updateData.images = newImages;
      }
    }

    // Validate sport types
    if (req.body.sportTypes && req.body.sportTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one sport type is required",
      });
    }

    // Perform the update
    turf = await Turf.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Respond with updated turf
    res.status(200).json({
      success: true,
      data: turf,
      message: "Turf updated successfully",
    });
  } catch (error) {
    // Handle specific validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Generic error handling
    res.status(500).json({
      success: false,
      message: "Error updating turf",
      error: error.message,
    });
  }
};

// @desc    Delete turf
// @route   DELETE /api/turfs/:id
// @access  Private/Admin
exports.deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    await turf.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get turf availability
// @route   GET /api/turfs/:id/availability
// @access  Public
exports.getTurfAvailability = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Please provide a date",
      });
    }

    // Get the turf
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // Get all bookings for the turf on the specified date
    const bookings = await Booking.find({
      turf: req.params.id,
      date: new Date(date),
      status: { $ne: "cancelled" },
    }).select("startTime endTime");

    // Generate time slots based on opening and closing hours
    const timeSlots = generateTimeSlots(turf.openingTime, turf.closingTime);

    // Mark slots as booked if they overlap with existing bookings
    const availabilitySlots = timeSlots.map((slot) => {
      const isBooked = bookings.some((booking) => {
        return (
          (slot.startTime >= booking.startTime &&
            slot.startTime < booking.endTime) ||
          (slot.endTime > booking.startTime &&
            slot.endTime <= booking.endTime) ||
          (slot.startTime <= booking.startTime &&
            slot.endTime >= booking.endTime)
        );
      });

      return {
        ...slot,
        isAvailable: !isBooked,
      };
    });

    res.status(200).json({
      success: true,
      data: availabilitySlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to generate time slots with improved 30-minute intervals
const generateTimeSlots = (openingTime, closingTime) => {
  const slots = [];
  const [openHour, openMinute] = openingTime.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  // Convert to minutes for easier calculation
  const openingMinutes = openHour * 60 + openMinute;
  const closingMinutes = closeHour * 60 + closeMinute;

  // Create 30-minute time slots
  for (let time = openingMinutes; time < closingMinutes; time += 30) {
    const startHour = Math.floor(time / 60);
    const startMinute = time % 60;

    // Calculate end time (30 minutes later)
    const endTime = time + 30;
    const endHour = Math.floor(endTime / 60);
    const endMinute = endTime % 60;

    // Skip if end time exceeds closing time
    if (endTime > closingMinutes) {
      continue;
    }

    // Format times as HH:MM
    const startTimeStr = `${String(startHour).padStart(2, "0")}:${String(
      startMinute
    ).padStart(2, "0")}`;
    const endTimeStr = `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;

    slots.push({
      startTime: startTimeStr,
      endTime: endTimeStr,
      isAvailable: true, // Will be updated based on bookings
    });
  }

  return slots;
};
