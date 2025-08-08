const db = require("../config/db");

socket.on('sendMessage', async (msg)=> {
      const { appointment_id, receiver_id, text, attachment_url } = msg;

  const fullMessage = {
    sender_id: socket.user.id,
    receiver_id,
    appointment_id,
    text,
    attachment_url,
    timestamp: new Date(),
  };

  // Emit to recipient
  io.to(receiver_id.toString()).emit("receiveMessage", fullMessage);

  // Save to DB
  try {
    await db.execute(
      `INSERT INTO messages (appointment_id, sender_id, receiver_id, text, attachment_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        appointment_id,
        socket.user.id,
        receiver_id,
        text,
        attachment_url || null,
      ]
    );
  } catch (err) {
    console.error("DB Error saving message:", err);
  }
});