const express = require("express");
const router = express.Router();
const { uploadMessage } = require("../middlewares/upload");
const { saveMessage, getMessagesByAppointment } = require("../controllers/messagesController");


router.post("/", uploadMessage.single("attachment"), saveMessage);
router.get("/:appointmentId", getMessagesByAppointment);

module.exports = router;