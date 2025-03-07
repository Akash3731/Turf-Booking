const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

// Create Razorpay Order
router.post("/payments/create-order", protect, paymentController.createOrder);

// Verify Razorpay payment
router.post("/payments/verify", protect, paymentController.verifyPayment);

// Get payment details
router.get("/payments/:id", protect, paymentController.getPaymentDetails);

module.exports = router;
