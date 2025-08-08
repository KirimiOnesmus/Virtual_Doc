import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import axios from "axios";

const Schedule = () => {
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  useEffect(() => {
    const fetchSchedule = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.warn("Token not found.");
        return;
      }

      const res = await axios.get("http://localhost:8080/api/schedule/weekly", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWeeklySchedule(res.data);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  };

  fetchSchedule();
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Schedule Settings</h2>

      {/* Sub-navigation (optional but recommended) */}
      <nav className="mb-4 flex gap-4 border-b pb-2">
        <NavLink
          to="manage-week"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-gray-600"
          }
        >
          Manage Week
        </NavLink>
      </nav>
      <div className="bg-gray-100 p-4 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-2">Your Weekly Schedule:</h3>
        {weeklySchedule.length === 0 ? (
          <p className="text-gray-500 italic">No days selected.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {weeklySchedule.map((item, idx) => (
              <li key={idx}>
                <span className="font-semibold">{item.day_of_week}</span>:{" "}
                {item.start_time} – {item.end_time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Schedule;
