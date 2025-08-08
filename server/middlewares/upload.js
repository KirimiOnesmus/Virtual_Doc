const multer = require("multer");
const path = require("path");

// Reusable file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image and document files are allowed"));
  }
};

// ========== Storage for messages ==========
const messageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/messages/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ========== Storage for avatars ==========
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Multer instances
const uploadMessage = multer({ storage: messageStorage, fileFilter });
const uploadAvatar = multer({ storage: avatarStorage, fileFilter });

module.exports = {
  uploadMessage,
  uploadAvatar,
};
