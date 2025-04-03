const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["trainer", "manager"],
      required: true,
    },
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: [true, "Turf selection is required"],
    },
    city: {
      type: String,
      required: true,
    },
    certificationPath: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    coverLetter: String,

    // Trainer-specific fields
    experience: String,
    specialization: String,
    certifications: String,

    // Manager-specific fields
    managementExperience: String,
    facilitiesManaged: String,
    teamSize: Number,

    referralSource: String,
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate turf details
ApplicationSchema.virtual("turfDetails", {
  ref: "Turf",
  localField: "turf",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Application", ApplicationSchema);
