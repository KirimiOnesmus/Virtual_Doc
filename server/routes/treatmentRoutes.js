const express = require("express");
const router = express.Router();
const { addPrescription } = require("../controllers/treatmentController");
const verifyToken = require("../middlewares/verifyToken");

router.post('/add',verifyToken, addPrescription);

module.exports =router;