const db = require("../config/db");
const moment = require("moment");

const getDoctorPayoutSummary = async (req, res) => {
  const userId = req.params.id;

  try {
    const [doctorRow] = await db.execute(`SELECT id FROM users WHERE id = ? `, [
      userId,
    ]);
    if (doctorRow.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const doctorId = doctorRow[0].id;
    const [[summary]] = await db.execute(
      `
            SELECT COUNT(*) AS total_transactions,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
            SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) AS total_earned
            FROM payments
            WHERE doctor_id = ?
            `,
      [doctorId]
    );
    res.json(summary);
  } catch (error) {
    console.error("Error fetching doctor payout summary:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getDoctorPayouts = async (req, res) => {
  const userId = req.params.id;

  try {
    // Get doctor ID
    const [doctorRow] = await db.execute(`SELECT id FROM users WHERE id = ?`, [
      userId,
    ]);
    if (doctorRow.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const doctorId = doctorRow[0].id;

    // 1. Get recent and pending payouts
    const [payoutRows] = await db.execute(
      `
      SELECT 
        p.amount, p.status, p.method, p.transaction_id,
        DATE_FORMAT(p.paid_at, '%Y-%m-%d') AS date,
        u.name AS patientName
      FROM payments p
      JOIN patients pt ON p.patient_id = pt.id
      JOIN users u ON pt.user_id = u.id
      WHERE p.doctor_id = ?
      ORDER BY p.paid_at DESC
      `,
      [doctorId]
    );

    const recent = payoutRows
      .filter((p) => p.status === "completed")
      .map((p) => ({
        date: p.date,
        patientName: p.patientName,
        status: p.status,
        amount: p.amount,
        paymentCode: p.transaction_id,
      }));

    const pending = payoutRows
      .filter((p) => p.status === "pending")
      .map((p) => ({
        date: p.date,
        patientName: p.patientName,
        status: p.status,
        amount: p.amount,
      }));

    // 2. Get earnings by month
    const [monthlyEarnings] = await db.execute(
      `
      SELECT 
        DATE_FORMAT(p.paid_at, '%b') AS month,
        SUM(p.amount) AS earnings
      FROM payments p
    WHERE p.doctor_id = ? AND p.status = 'completed'
    GROUP BY DATE_FORMAT(p.paid_at, '%b')
    ORDER BY MIN(p.paid_at)
      `,
      [doctorId]
    );

    // 3. Total earnings
    const [totalRow] = await db.execute(
      `
      SELECT SUM(amount) AS totalEarnings
      FROM payments
      WHERE doctor_id = ? AND status = 'completed'
      `,
      [doctorId]
    );

    const totalEarnings = totalRow[0].totalEarnings || 0;

    res.json({
      recent,
      pending,
      earnings: monthlyEarnings,
      totalEarnings,
    });
  } catch (error) {
    console.error("Error fetching doctor payouts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createPayement = async (req, res) => {
  const {
    appointment_id,
    doctor_id,
    patient_id,
    amount,
    method,
    transaction_id,
  } = req.body;

  if (
    !appointment_id ||
    !doctor_id ||
    !patient_id ||
    !amount ||
    !method ||
    !transaction_id
  ) {
    return res.status(400).json({ error: "All fields are required !" });
  }
  try {
    const paidAt = new Date();
    await db.execute(
      `
  INSERT INTO payments (appointment_id, doctor_id, patient_id, amount, method, transaction_id, status, paid_at)
  VALUES (?, ?, ?, ?, ?, ?, 'completed', ?)
  `,
      [
        appointment_id,
        doctor_id,
        patient_id,
        amount,
        method,
        transaction_id,
        paidAt,
      ]
    );

    await db.execute(
      `UPDATE appointments SET status = "confirmed" WHERE id= ?`,
      [appointment_id]
    );
    res
      .status(201)
      .json({ message: "Payment recorded and appointment confirmed." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Failed to create payment", error);
  }
};

const getPendingBills = async (req, res) => {
 const userId = req.params.patientId;
    const [patientRows] = await db.execute(
      `SELECT id FROM patients WHERE id = ?`,
      [userId]
    );
    if (patientRows.length === 0) {
      res.status(404).json({
        message: "Patient not found !!",
      });
    }
const patientId = patientRows[0].id;
console.log("Patient Id:", patientId);
  try {
    const [appointments] = await db.execute(
      `
       SELECT 
        a.id AS appointmentId,
        DATE_FORMAT(a.appointment_time, '%b-%Y-%d') AS date,
        a.payment_status AS status,
        a.department AS department,
        u.name AS doctorName,
        u.avatar AS doctorAvatar,
        p.amount
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE a.patient_id = ? AND a.payment_status = 'unpaid'
      ORDER BY a.appointment_time DESC
      `,
      [patientId]
    );

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching pending bills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPaymentsByPatient = async (req, res) => {
  const userId = req.params.patientId;
  console.log("Patient user ID:", userId);
  try {
    const [patientRows] = await db.execute(
      `SELECT id FROM patients WHERE id = ?`,
      [userId]
    );
    if (patientRows.length === 0) {
      res.status(404).json({
        message: "Patient not found !!",
      });
    }
    const id = patientRows[0].id;
    const [rows] = await db.execute(
      `SELECT 
          p.*, 
          a.appointment_time AS date, 
          u.name AS doctorName
          FROM payments p
          JOIN appointments a ON p.appointment_id = a.id
          JOIN doctors d ON p.doctor_id = d.id
          JOIN users u ON d.user_id = u.id
          WHERE p.patient_id = ?
          ORDER BY p.paid_at DESC`,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching payments by patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updatePaymentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE payments SET status = ? WHERE appointment_id = ?`,
      [status, appointmentId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({ message: "Payment status updated." });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getDoctorPayoutSummary,
  getDoctorPayouts,
  createPayement,
  getPendingBills,
  getPaymentsByPatient,
  updatePaymentStatus,
};
