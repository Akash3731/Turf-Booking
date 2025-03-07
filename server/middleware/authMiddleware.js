// In middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
  console.log("AUTH MIDDLEWARE - PROTECT");
  console.log("Headers:", req.headers);

  try {
    let token;

    // Check if auth header exists and starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("TOKEN FOUND:", token.substring(0, 15) + "...");
    } else {
      console.log("NO TOKEN FOUND IN AUTHORIZATION HEADER");
    }

    // Check if token exists
    if (!token) {
      console.log("AUTHORIZATION FAILED: No token provided");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route - no token",
      });
    }

    try {
      // Verify token
      console.log("VERIFYING TOKEN with secret");
      console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("TOKEN DECODED SUCCESSFULLY:", decoded);

      // Get user from the token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.log("USER NOT FOUND FOR TOKEN ID:", decoded.id);
        return res.status(401).json({
          success: false,
          message: "User not found with this token",
        });
      }

      console.log("USER FOUND:", {
        id: user._id,
        name: user.name,
        role: user.role,
      });

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("TOKEN VERIFICATION FAILED:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized - invalid token",
      });
    }
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in auth middleware",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log("AUTH MIDDLEWARE - AUTHORIZE");
    console.log("User role:", req.user.role);
    console.log("Required roles:", roles);
    console.log("Has permission:", roles.includes(req.user.role));

    if (!req.user || !roles.includes(req.user.role)) {
      console.log("AUTHORIZATION FAILED: User role not allowed");
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    console.log("AUTHORIZATION SUCCESSFUL");
    next();
  };
};
