const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const { 
    createAppointment,
    getAppointments,
    getUpcomingAppoitments,
    cancelAppointment,
    acceptAppointments,
    rejectAppointment,
    getAllAppointmentsForDoctor,
    getAppointmentsForPatient,
    getAppointmentDetails
} = require("../controllers/appointmentController");


router.post("/",verifyToken, createAppointment);
router.get("/",verifyToken,getAppointments);
router.get("/patients/:id/upcoming-appointment",verifyToken,getUpcomingAppoitments);
router.patch("/:id/cancel", verifyToken, cancelAppointment);
router.get("/details/:id", verifyToken, getAppointmentDetails);
router.patch("/:id/accept",verifyToken,acceptAppointments);
router.patch("/:id/reject", verifyToken,rejectAppointment);
router.get("/doctor/:id", verifyToken, getAllAppointmentsForDoctor);
router.get("/patient/:id",verifyToken,getAppointmentsForPatient);


module.exports = router;
 