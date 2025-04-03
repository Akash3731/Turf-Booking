const express = require("express");
const {
  createApplication,
  getUserApplications,
  getSingleApplication,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

// User routes
router.post("/", upload.single("certification"), createApplication);
router.get("/", protect, getUserApplications);

router.get("/admin", protect, authorize("admin"), getAllApplications);

// This route needs to come AFTER more specific routes
router.get("/:id", protect, getSingleApplication);
router.delete("/:id", protect, deleteApplication);
router.put("/:id/status", protect, authorize("admin"), updateApplicationStatus);

module.exports = router;
