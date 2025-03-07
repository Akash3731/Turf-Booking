const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Turf is required"],
      ref: "Turf",
    },
    date: {
      type: Date,
      required: [true, "Please add a booking date"],
    },
    startTime: {
      type: String,
      required: [true, "Please add a start time"],
    },
    endTime: {
      type: String,
      required: [true, "Please add an end time"],
    },
    pricing: {
      pricePerHour: {
        type: Number,
        required: [true, "Price per hour is required"],
      },
      currency: {
        type: String,
        enum: ["INR", "USD"],
        default: "INR",
      },
      totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
      },
    },
    duration: {
      type: Number,
      required: [true, "Please add duration in hours"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    specialRequests: {
      type: String,
      maxlength: [200, "Special requests cannot exceed 200 characters"],
    },
    numberOfPlayers: {
      type: Number,
      min: [1, "At least one player is required"],
      max: [100, "Maximum 100 players allowed"],
    },
    additionalDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent double bookings
bookingSchema.index(
  { turf: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

// Virtual to populate turf details
bookingSchema.virtual("turfDetails", {
  ref: "Turf",
  localField: "turf",
  foreignField: "_id",
  justOne: true,
});

// Virtual to calculate total amount
bookingSchema.virtual("totalAmount").get(function () {
  return this.pricing ? this.pricing.totalPrice : 0;
});

// Middleware to set pricing before save
bookingSchema.pre("save", function (next) {
  // Ensure pricing is set correctly
  if (!this.pricing) {
    this.pricing = {
      pricePerHour: 0,
      currency: "INR",
      totalPrice: 0,
    };
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
