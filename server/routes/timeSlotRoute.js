const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const {
  saveWeeklySchedule,
  generateTimeSlots,
  getDoctorTimeSlots,
   getWeeklySchedule,
   getWeeklyScheduleByDoctorId
} = require("../controllers/timeSlotController");

// Save weekly schedule: POST /api/schedule/save
router.post("/save",verifyToken, saveWeeklySchedule);

// Generate time slots from weekly: POST /api/schedule/generate/:doctorId
router.post("/generate", verifyToken, generateTimeSlots)

// Get available future slots: GET /api/schedule/available/:doctorId
router.get("/available/:doctorId", getDoctorTimeSlots);
// Add this route to get weekly schedule of logged-in doctor
router.get("/weekly", verifyToken, getWeeklySchedule);

//Public Api route
router.get("/weekly/:doctorId", getWeeklyScheduleByDoctorId);

module.exports = router;