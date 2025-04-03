const mongoose = require("mongoose");

const turfSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a turf name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    city: {
      type: String,
      required: [true, "Please add a city"],
    },
    images: [
      {
        type: String,
      },
    ],
    pricing: {
      pricePerHour: {
        type: Number,
        required: [true, "Please add price per hour"],
        min: [0, "Price must be a positive number"],
      },
      currency: {
        type: String,
        enum: ["INR", "USD"],
        default: "INR",
      },
    },
    facilities: [
      {
        type: String,
      },
    ],
    sportTypes: [
      {
        type: String,
        enum: ["Football", "Cricket", "Basketball", "Tennis", "Other"],
        required: [true, "Please specify at least one sport type"],
      },
    ],
    openingTime: {
      type: String,
      required: [true, "Please add opening time"],
    },
    closingTime: {
      type: String,
      required: [true, "Please add closing time"],
    },
    size: {
      type: String,
      required: [true, "Please add the turf size"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    razorpayAccountId: {
      type: String,
      required: [true, "Please add Razorpay Account ID"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get price (for backward compatibility)
turfSchema.virtual("price").get(function () {
  return this.pricing ? this.pricing.pricePerHour : 0;
});

// Virtual for reviews
turfSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "turf",
  justOne: false,
});

module.exports = mongoose.model("Turf", turfSchema);
