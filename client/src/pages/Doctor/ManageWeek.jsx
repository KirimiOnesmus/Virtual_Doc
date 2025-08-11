import React, { useState } from "react";
import api from "../../config/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ManageWeek = () => {
  const token = sessionStorage.getItem("token");
  let doctorId = null;
  const navigate = useNavigate();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      doctorId = decoded?.id || decoded?.doctor_id || decoded?.user?.id || null;
    } catch (error) {
      console.error("Token decode error:", error);
    }
  } else {
    console.warn("Token is missing from localStorage");
  }
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedDays, setSelectedDays] = useState([]);
  const [times, setTimes] = useState({});

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (day, field, value) => {
    setTimes((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!doctorId) {
      alert("Doctor ID not found. Please log in again.");
      return;
    }
    const weeklyData = selectedDays.map((day) => ({
      doctor_id: doctorId,
      day_of_week: day,
      start_time: times[day]?.start,
      end_time: times[day]?.end,
      is_unavailable: false,
    }));

    try {
      await api.post("/schedule/save", { schedule: weeklyData });
      alert("Weekly availability saved!");
      navigate("/dashboard/schedule");
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule");
    }
  };

  return (
    <div className="p-4 max-h-screen overflow-auto scrollbar-hide">
      <h2 className="text-xl font-bold mb-4">Set Weekly Availability</h2>
      <form className="space-y-4">
        {days.map((day) => (
          <div key={day} className="border p-3 rounded-md">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => toggleDay(day)}
              />
              {day}
            </label>
            {selectedDays.includes(day) && (
              <div className="flex gap-3 mt-2">
                <input
                  type="time"
                  value={times[day]?.start || ""}
                  onChange={(e) =>
                    handleTimeChange(day, "start", e.target.value)
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="time"
                  value={times[day]?.end || ""}
                  onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            )}
          </div>
        ))}
      </form>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-md font-semibold
           hover:bg-white hover:text-blue-500 hover:border border-blue-500"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default ManageWeek;
