const Application = require("../models/Application");
const path = require("path");
const fs = require("fs");
const authController = require("./authController"); // Import the auth controller

// @desc    Submit new job application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res) => {
  try {
    // Handle file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // Prepare application data
    const applicationData = {
      ...req.body,
      turf: req.body.turfId, // Explicitly map turfId to turf
      certificationPath: `/uploads/applications/${req.file.filename}`,
      status: "pending", // Default status
    };

    // Remove turfId from the data to avoid extra fields
    delete applicationData.turfId;

    // Create application
    const application = await Application.create(applicationData);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Application submission error:", error);

    // Clean up uploaded file if application creation fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error("Failed to delete uploaded file:", fileError);
      }
    }

    // Send more detailed error response
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
      details: error.errors
        ? Object.keys(error.errors).map((key) => error.errors[key].message)
        : [],
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate("turf", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getSingleApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("turf", "name address");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Optional: Delete associated certification file
    if (application.resumePath) {
      try {
        fs.unlinkSync(
          path.join(__dirname, "..", "public", application.resumePath)
        );
      } catch (fileError) {
        console.error("Failed to delete certification file:", fileError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: error.message,
    });
  }
};

// @desc    Get all applications (for admin)
// @route   GET /api/applications/admin
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skipIndex = (page - 1) * limit;

    // Build query
    const query = {};
    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }

    // Find applications with pagination
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)
      .populate("turf", "name")
      .populate("user", "name email");

    // Count total applications
    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      pagination: {
        current: page,
        total: total,
        pages: Math.ceil(total / limit),
      },
      data: applications,
    });
  } catch (error) {
    console.error("Error in getAllApplications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// @desc    Update application status (Admin only)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Find application and populate related data
    const application = await Application.findById(req.params.id)
      .populate("turf", "name")
      .populate("user", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update application status
    application.status = status;
    await application.save();

    // Handle user creation or notifications using the auth controller
    const statusResult = await authController.handleApplicationStatus(
      application,
      status
    );

    // Prepare response data
    const responseData = {
      success: true,
      message: "Application status updated",
      data: application,
    };

    // Include user account info if created
    if (status === "accepted" && statusResult.success) {
      responseData.userAccount = {
        created: statusResult.userCreated,
        email: statusResult.user.email,
        role: statusResult.user.role,
      };
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};
