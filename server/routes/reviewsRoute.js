const express =require("express");
const router= express.Router();
const verifyToken = require("../middlewares/verifyToken");
const{getDoctorReviews, addReviews}= require( "../controllers/reviewsController");

router.get("/doctor/:doctorId",getDoctorReviews);

router.post("/",verifyToken,addReviews);

module.exports = router;