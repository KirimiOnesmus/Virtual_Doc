import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import api from "../../config/api";

const DoctorDetails = ({ doctor, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const BASE_URL = "https://virtualdoc-server.onrender.com/api"
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/doctor/${doctor.id}`);
        setReviews(res.data);
      } catch (error) {
        console.log("Failed to fetch reviews:", error);
        setReviews([]);
      }
    };
    const fetchSchedule = async () => {
      try {
        const res = await api.get(`/schedule/weekly/${doctor.id}`);
        setWeeklySchedule(res.data);
      } catch (error) {
        console.log("Error fetching schedule:", error);
      }
    };
    if (doctor?.id) {
      fetchReviews();
      fetchSchedule();
    }
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || rating === 0) return;

    const newReview = {
      text: reviewText.trim(),
      rating,
      doctorId: doctor.id,
    };

    try {
      const token = sessionStorage.getItem("token");
      await api.post("/reviews", newReview);
      setReviews([newReview, ...reviews]);
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const formattedHour = ((h + 11) % 12) + 1;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-40 z-40">
        <div
          className="fixed top-0 right-0 w-full md:w-[60%] h-full bg-white z-50 overflow-y-auto shadow-xl p-4 sm:p-6 animate-slideInRight"
          onClick={(e) => e.stopPropagation()}
        >
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold font-mono">Doctor Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">
              <IoCloseOutline />
            </button>
          </div>

         
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 rounded-full overflow-hidden">
              <img
                src={`${BASE_URL} ${doctor.avatar}`}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold">Dr. {doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
              <p className="text-sm text-gray-600 mt-2">
                Address: {doctor.address || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Contact: {doctor.phonenumber || "N/A"}
              </p>
            </div>
          </div>

    
          <div className="border-b mb-4 flex gap-2 text-sm sm:text-base overflow-x-auto">
            {["Overview", "Reviews"].map((tab) => (
              <button
                key={tab}
                className={`px-3 sm:px-4 py-2 ${
                  selectedTab === tab ? "border-b-2 border-blue-500 font-bold" : ""
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

         
          <div className="space-y-4 text-sm sm:text-base">
            {selectedTab === "Overview" && (
              <>
                <p className="text-gray-600">
                  {doctor.bio || "This doctor has not provided additional information."}
                </p>

                <div>
                  <h4 className="font-semibold text-base sm:text-lg mb-2">
                    Available Consultation Times
                  </h4>
                  <ul className="space-y-1">
                    {weeklySchedule.length > 0 ? (
                      weeklySchedule.map((day, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <FcCalendar />
                          <span>
                            {day.day_of_week}: {formatTime(day.start_time)} –{" "}
                            {formatTime(day.end_time)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">Schedule not available.</li>
                    )}
                  </ul>
                </div>
              </>
            )}

            {selectedTab === "Reviews" && (
              <>
               
                <div>
                  <h4 className="font-semibold text-base sm:text-lg mb-2">User Reviews</h4>
                  {reviews.length === 0 ? (
                    <p className="text-gray-600">No reviews available yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {reviews.map((r, i) => (
                        <li key={i} className="border p-3 rounded shadow-sm space-y-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, j) => (
                              <FaStar
                                key={j}
                                className={`text-base ${
                                  j < r.rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-800">{r.text}</p>
                          <div className="text-xs text-gray-500">
                            By {r.name} — {new Date(r.date).toLocaleString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

            
                <div>
                  <h4 className="font-semibold text-base sm:text-lg mb-2">Leave a Review</h4>
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <textarea
                      placeholder="Your review"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows="3"
                      className="w-full border p-2 rounded outline-none focus:border-blue-500"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Your Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-xl ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDetails;
