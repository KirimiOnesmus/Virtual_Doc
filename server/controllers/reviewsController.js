const db = require("../config/db");

const getDoctorReviews = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [reviews] = await db.execute(
      `SELECT u.name, r.text, r.rating, r.date
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.doctor_id = ?
       ORDER BY r.date DESC`,
      [doctorId]
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Ërror fetching reviews", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
const addReviews = async (req, res) => {
  const userId = req.user.id;
  const { doctorId,  text, rating } = req.body;
//   console.log(req.body);
  if (!doctorId || !text || !rating) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [userRows] = await db.execute("SELECT name FROM users WHERE id = ?", [
      userId,
    ]);

    // const patientName = userRows[0]?.name || "Anonymous";
    await db.execute(
      `INSERT INTO reviews (doctor_id, user_id,  text, rating, date)
       VALUES (?, ?, ?, ?,?)`,
      [doctorId, userId, text, rating,new Date()]
    );
    res.status(201).json({
      message: "Review Submited successfully",
      review: {
        doctorId,
        // name: patientName,
        text,
        rating,
        date: new Date(),
      },
    });
  } catch (error) {
    console.error("Error adding the review:", error);
    res.status(500).json({ error: "Failed to submit the review " });
  }
};
module.exports = {
  getDoctorReviews,
  addReviews,
};
