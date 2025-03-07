// In routes/userRoutes.js
const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserBookings,
  changeUserRole,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// TEMPORARILY COMMENT OUT THE ROLE CHECK
// router.use(authorize('admin'));

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/bookings", getUserBookings);
router.put("/:id/role", changeUserRole);

module.exports = router;
