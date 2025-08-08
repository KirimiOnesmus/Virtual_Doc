const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("./config/db");
const app = express();
const server = http.createServer(app);

// Setup socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// JWT Authentication middleware for sockets
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Setup middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const doctorsRoute = require("./routes/doctorsRoute");
const scheduleRoutes = require("./routes/timeSlotRoute");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reviews = require("./routes/reviewsRoute");
const messageRoutes = require("./routes/messageRoutes");
const patientRoutes =require("./routes/patientRoutes");
const treatmentRoutes = require ("./routes/treatmentRoutes");
const prescriptionRoute = require("./routes/prescription");
const paymentsRoutes = require("./routes/paymentRoute");


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", userRoutes);
app.use("/api/doctors", doctorsRoute);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviews);
app.use("/api/messages", messageRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/treatment", treatmentRoutes);
app.use("/api/prescriptions",prescriptionRoute);
app.use("/api/payments",paymentsRoutes);



app.use("/uploads", express.static("uploads")); // making upload public

// Test route
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() as currentTime");
    res.json({ server: "Online", currentTime: rows[0].currentTime });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// Socket events
io.on("connection", async (socket) => {
  const userId = socket.user.id;
  console.log(`User connected: ${userId}`);
  // Set user as online
  try {
    const role = socket.user.role;
    if (role === "doctor") {
      await db.execute("UPDATE users SET online = TRUE WHERE id = ?", [
        userId,
      ]);
    } else if (role === "patient") {
      await db.execute("UPDATE users SET online = TRUE WHERE id = ?", [
        userId,
      ]);
    }
  } catch (err) {
    console.error("Error setting user online:", err);
  }
  //joining  the meet
  socket.on("join-room", (roomId) => {});

  socket.on("sendMessage", async (msg) => {
    const { appointment_id, receiver_id, text, attachment_url } = msg;
    console.log("Sending message with:", {
      appointment_id,
      receiver_id,
      text,
      attachment_url,
    });
    socket.emit("sendMessage", {
      appointment_id,
      receiver_id,
      text,
      attachment_url,
    });
    if (!receiver_id) {
      console.error("receiver_id is undefined in sendMessage");
      return;
    }
    const fullMessage = {
      sender_id: userId,
      receiver_id,
      appointment_id,
      text,
      attachment_url,
      timestamp: new Date(),
    };

    io.to(receiver_id.toString()).emit("receiveMessage", fullMessage);
    if (!receiver_id) {
      console.error("receiver_id is undefined in sendMessage");
      return;
    }
  });

  socket.on("disconnect", async () => {
    console.log(`Socket disconnected: ${userId}`);
    // Set user as offline
    try {
      await db.execute("UPDATE users SET online = FALSE WHERE id = ?", [
        userId,
      ]);
    } catch (err) {
      console.error("Error setting user offline:", err);
    }
  });
});

// Final: start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
