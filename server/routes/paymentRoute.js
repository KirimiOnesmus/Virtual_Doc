const express = require("express");
const router = express.Router();
const {
  getDoctorPayoutSummary,
  getDoctorPayouts,
  getPendingBills,
  getPaymentsByPatient,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const verifyToken = require("../middlewares/verifyToken");

// ========== Doctor-Side ==========
router.get("/payouts/:id", verifyToken, getDoctorPayouts);
router.get("/summary/:id", verifyToken, getDoctorPayoutSummary);

// ========== Patient-Side ==========
router.get("/patient/:patientId/pendingbills", verifyToken, getPendingBills);
router.get("/patient/:patientId", verifyToken, getPaymentsByPatient);

// ========== General ==========
// router.post("/", verifyToken, createPayment);
router.patch("/status/:paymentId", verifyToken, updatePaymentStatus);


module.exports = router;