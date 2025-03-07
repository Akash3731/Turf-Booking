const express = require("express");
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// User and admin routes
router.post("/", createBooking);
router.get("/", getBookings);
router.get("/:id", getBooking);
router.put("/:id", updateBooking);
router.put("/:id/cancel", cancelBooking);

module.exports = router;
