const Booking = require("../models/Booking");
const Turf = require("../models/Turf");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    // Add user ID to request body
    req.body.user = req.user.id;

    // Check if turf exists
    const turf = await Turf.findById(req.body.turf);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // Calculate total price
    const duration = parseFloat(req.body.duration);
    const totalPrice = turf.price * duration;

    // Store price details with currency
    req.body.pricing = {
      pricePerHour: turf.price,
      currency: "INR",
      totalPrice: totalPrice,
    };

    // Maintain backward compatibility
    req.body.totalPrice = totalPrice;

    // Check for existing bookings (prevent double booking)
    const existingBooking = await Booking.findOne({
      turf: req.body.turf,
      date: new Date(req.body.date),
      $or: [
        {
          startTime: req.body.startTime,
        },
        {
          endTime: req.body.endTime,
        },
        {
          $and: [
            { startTime: { $lt: req.body.endTime } },
            { endTime: { $gt: req.body.startTime } },
          ],
        },
      ],
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // Create booking
    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res) => {
  try {
    let query;

    // If user is admin, get all bookings
    if (req.user.role === "admin") {
      query = Booking.find()
        .populate({
          path: "user",
          select: "name email phone",
        })
        .populate({
          path: "turf",
          select: "name address city",
        });
    } else {
      // If user is not admin, get only their bookings
      query = Booking.find({ user: req.user.id }).populate({
        path: "turf",
        select: "name address city images price",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments(
      req.user.role === "admin" ? {} : { user: req.user.id }
    );

    query = query.skip(startIndex).limit(limit).sort("-createdAt");

    // Execute query
    const bookings = await query;

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
      count: bookings.length,
      pagination,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "turf",
        select: "name address city images price facilities sportTypes",
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user is booking owner or admin
    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    // If changing date/time, check for double booking
    if (req.body.date || req.body.startTime || req.body.endTime) {
      const existingBooking = await Booking.findOne({
        turf: booking.turf,
        date: req.body.date || booking.date,
        _id: { $ne: req.params.id },
        $or: [
          {
            startTime: req.body.startTime || booking.startTime,
          },
          {
            endTime: req.body.endTime || booking.endTime,
          },
          {
            $and: [
              { startTime: { $lt: req.body.endTime || booking.endTime } },
              { endTime: { $gt: req.body.startTime || booking.startTime } },
            ],
          },
        ],
        status: { $ne: "cancelled" },
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: "This time slot is already booked",
        });
      }
    }

    // If changing duration, recalculate price
    if (req.body.duration) {
      const turf = await Turf.findById(booking.turf);
      const totalPrice = turf.price * parseFloat(req.body.duration);

      req.body.pricing = {
        pricePerHour: turf.price,
        currency: "INR",
        totalPrice: totalPrice,
        duration: parseFloat(req.body.duration),
      };
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
