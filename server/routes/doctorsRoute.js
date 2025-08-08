const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {getAllDoctors, getSpecialties,getDoctorsStats, getTreatedPatients, getDoctorByUserId} = require("../controllers/doctorsController");
const { getTodayAppointments } = require("../controllers/appointmentController");

// GET /api/doctors
router.get("/", getAllDoctors);
router.get("/specialties", getSpecialties);
router.get("/:id/stats", verifyToken,getDoctorsStats);
router.get("/:id/appointments/today", verifyToken, getTodayAppointments);
router.get("/:doctorId/patients", verifyToken, getTreatedPatients);
router.get('/by-user/:userId',verifyToken,getDoctorByUserId);
module.exports = router;
 