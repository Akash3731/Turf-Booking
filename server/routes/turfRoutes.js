const express = require("express");
const {
  getTurfs,
  getTurf,
  createTurf,
  updateTurf,
  deleteTurf,
  getTurfAvailability,
} = require("../controllers/turfController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public routes
router.get("/", getTurfs);
router.get("/:id", getTurf);
router.get("/:id/availability", getTurfAvailability);

// Admin routes
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  createTurf
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  updateTurf
);
router.delete("/:id", protect, authorize("admin"), deleteTurf);

module.exports = router;
