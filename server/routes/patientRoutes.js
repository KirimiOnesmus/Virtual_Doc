const express =require("express");
const router =express.Router();
const {getpatientDetails} = require("../controllers/patientsController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:id",verifyToken, getpatientDetails);

module.exports= router;