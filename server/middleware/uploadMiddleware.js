const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure applications directory exists
const applicationsDir = path.join(__dirname, "../uploads/applications");
fs.mkdirSync(applicationsDir, { recursive: true });

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, applicationsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type for resumes
const checkFileType = (file, cb) => {
  // Allowed file extensions
  const filetypes = /pdf|doc|docx/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetypes =
    /application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/;
  const mimetype = mimetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only PDF and Word documents are allowed!");
  }
};

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = { upload };
