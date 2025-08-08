const express = require("express");
const router = express.Router();
const {
  registerDoctor,
  getUserById,
  getMyProfile,
  updatedProfile,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const { uploadAvatar } = require("../middlewares/upload");

router.post(
  "/register-doctor",
  verifyToken,
  checkRole("admin", "super-admin"),
  registerDoctor
);
// Get own profile (doctor or patient)
router.get("/profile", verifyToken, getMyProfile);

// Update doctor profile (after registration)
router.put("/profile", verifyToken,  uploadAvatar.single("avatar"),updatedProfile);

//Admin and Super Admin only
router.get("/users/:id", verifyToken, getUserById);

module.exports = router;
