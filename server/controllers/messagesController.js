const db = require("../config/db");
const saveMessage = async (req, res) => {
  const { appointment_id, sender_id, receiver_id, text } = req.body;
const safeAppointmentId = appointment_id ?? null;
const safeSenderId = sender_id ?? null;
const safeReceiverId = receiver_id ?? null;
const safeText = text ?? null;
  const attachment_url = req.file ? `/uploads/messages/${req.file.filename}` : null;

  try {
    const [result] = await db.execute(
      `INSERT INTO messages (appointment_id, sender_id, receiver_id, text, attachment_url)
       VALUES (?, ?, ?, ?, ?)`,
       [safeAppointmentId, safeSenderId, safeReceiverId, safeText, attachment_url]
    );

    res.status(201).json({
      message: "Message saved",
      messageId: result.insertId,
      attachment: attachment_url,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
};

const getMessagesByAppointment = async (req, res) => {
  const appointmentId = req.params.appointmentId;
  try {
    const [messages] = await db.execute(
      `SELECT * FROM messages WHERE appointment_id = ? ORDER BY timestamp ASC`,
      [appointmentId]
    );
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

module.exports={
    saveMessage,
    getMessagesByAppointment
}
