// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Generate JWT Token
// const generateToken = (id) => {
//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     throw new Error("JWT_SECRET environment variable is not set");
//   }
//   return jwt.sign({ id }, secret, {
//     expiresIn: "30d",
//   });
// };

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // Create new user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       phone,
//     });

//     if (user) {
//       res.status(201).json({
//         success: true,
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           role: user.role,
//         },
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Invalid user data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Login user & get token
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check for user email
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // Check if password matches
//     const isMatch = await user.matchPassword(password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//       },
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Get user profile
// // @route   GET /api/auth/profile
// // @access  Private
// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

// Generate a secure random password
const generateSecurePassword = (length = 12) => {
  const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijkmnopqrstuvwxyz";
  const numberChars = "23456789";
  const specialChars = "!@#$%^&*_-+=";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // Ensure the password has at least one character from each category
  let password = "";
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );
  password += lowercaseChars.charAt(
    Math.floor(Math.random() * lowercaseChars.length)
  );
  password += numberChars.charAt(
    Math.floor(Math.random() * numberChars.length)
  );
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Fill the rest of the password with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password to ensure the required characters aren't always in the same position
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send welcome email with credentials
const sendWelcomeEmail = async (user, password, turfName) => {
  try {
    console.log("Attempting to send welcome email to:", user.email);

    const transporter = createTransporter();

    // Determine role-specific content based on user role or provided role info
    const roleDisplay = user.staffRole || user.role;
    const roleSpecificContent =
      roleDisplay === "trainer"
        ? "As a trainer, you'll be able to manage your sessions, view your schedule, and interact with members."
        : "As a manager, you'll be able to oversee facility operations, manage staff, and handle bookings.";

    const mailOptions = {
      from: `"Turf Booking Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Welcome to ${turfName} - Your Account Details`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4CAF50;">Welcome to the Team!</h1>
          </div>
          
          <p>Hello ${user.name},</p>
          
          <p>We're excited to welcome you to ${turfName} as our new <strong>${roleDisplay}</strong>! Your application has been reviewed and accepted.</p>
          
          <p>${roleSpecificContent}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Login Credentials</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p style="font-size: 13px; color: #777; margin-top: 10px;">Please change your password after your first login for security reasons.</p>
          </div>
          
          <p>You can log in to your account by visiting <a href="${
            process.env.APP_URL || "http://localhost:5173"
          }/login" style="color: #4CAF50;">our website</a>.</p>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The Turf Booking Team</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #777;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw the error, just log it so the process can continue
    return { error: error.message };
  }
};

// Send general application status notification
const sendStatusNotification = async (email, role, turfName, status) => {
  try {
    if (!email) return;
    console.log(`Sending ${status} notification to ${email}`);

    const transporter = createTransporter();

    const statusMessages = {
      reviewed:
        "Your application is currently under review. We'll be in touch soon with a final decision.",
      rejected:
        "After careful consideration, we regret to inform you that we're unable to move forward with your application at this time.",
    };

    const mailOptions = {
      from: `"Turf Booking Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Application Status Update: ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <p>Hello,</p>
          
          <p>Thank you for your interest in the ${role} position at ${turfName}.</p>
          
          <p>${
            statusMessages[status] ||
            `Your application status has been updated to: ${status}`
          }</p>
          
          <p>Best regards,<br>The Turf Booking Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Status notification email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending status notification email:", error);
    // Don't throw, just log - we don't want to fail the application update if email fails
    return { error: error.message };
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        staffRole: user.staffRole,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        staffRole: user.staffRole,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a user account from an accepted application
// @route   Not directly exposed as an API endpoint - called from applicationController
// @access  Private/Admin (via applicationController)
exports.createUserFromApplication = async (applicationData) => {
  try {
    console.log(
      `Creating user from application for ${applicationData.email} with role ${applicationData.role}`
    );

    // Generate a secure random password - always generate a new one
    const password = generateSecurePassword(12);
    console.log(`Generated password: ${password.substring(0, 3)}******`); // Log only first 3 chars for security

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store the actual role as staffRole to work around schema limitations
    const staffRole = applicationData.role; // 'trainer' or 'manager'

    // Check if user already exists
    const existingUser = await User.findOne({ email: applicationData.email });

    if (existingUser) {
      console.log(
        `User ${existingUser.email} already exists, updating their staff role and password`
      );
      // Update both staffRole and password for existing user
      existingUser.staffRole = staffRole;
      existingUser.password = hashedPassword; // Update password with new one
      await existingUser.save();

      // Send welcome email with the new credentials
      const turfName = applicationData.turf?.name || "Our Turf Facility";

      await sendWelcomeEmail(
        {
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          staffRole: staffRole,
        },
        password, // Send the actual new password
        turfName
      );

      return { user: existingUser, isNew: false, plainPassword: password };
    }

    // Create a new user with the standard "user" role
    // but with the actual role stored in a custom field
    const newUser = await User.create({
      name: `${applicationData.firstName} ${applicationData.lastName}`,
      email: applicationData.email,
      password: hashedPassword,
      phone: applicationData.phone || "",
      role: "user", // Default role from schema
      staffRole: staffRole, // Custom field for the actual role
      city: applicationData.city,
    });

    console.log(`New user created with ID: ${newUser._id}`);

    // Send welcome email with credentials
    const turfName = applicationData.turf?.name || "Our Turf Facility";
    await sendWelcomeEmail(
      {
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        email: applicationData.email,
        role: newUser.role,
        staffRole: staffRole,
      },
      password,
      turfName
    );

    return { user: newUser, isNew: true, plainPassword: password };
  } catch (error) {
    console.error("Error creating user from application:", error);
    // Return the error instead of throwing it
    return { error: error.message };
  }
};

// @desc    Handle application status updates and user creation
// @route   Not directly exposed - called from applicationController
// @access  Private/Admin (via applicationController)
exports.handleApplicationStatus = async (application, status) => {
  try {
    console.log(
      `Handling application status change to ${status} for ${application.email}`
    );

    // If application is accepted, create a user account with the appropriate role
    if (status === "accepted") {
      const result = await this.createUserFromApplication(application);

      if (result.error) {
        console.error("Error in user creation process:", result.error);
        return {
          success: false,
          error: result.error,
        };
      }

      return {
        success: true,
        userCreated: result.isNew,
        user: {
          _id: result.user._id,
          email: result.user.email,
          role: result.user.staffRole || result.user.role,
        },
      };
    }
    // For other statuses, just send a notification
    else {
      await sendStatusNotification(
        application.email,
        application.role,
        application.turf?.name || "our facility",
        status
      );
      return { success: true, notificationSent: true };
    }
  } catch (error) {
    console.error("Error handling application status:", error);
    return { success: false, error: error.message };
  }
};
