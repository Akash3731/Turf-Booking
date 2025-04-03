const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables (just do this ONCE at the top)
require("dotenv").config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Make uploads folder static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/turfs", require("./routes/turfRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api", require("./routes/paymentRoutes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Turf Booking API Running" });
});

// Error middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
