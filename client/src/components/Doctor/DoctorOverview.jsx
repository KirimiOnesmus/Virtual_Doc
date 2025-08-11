
import React, { useState, useEffect } from "react";
import Card from "../Card";
import { useOutletContext } from "react-router-dom";
import api from "../../config/api";

const DoctorOverview = () => {
  const token = sessionStorage.getItem("token");
  const { userData } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get(`/doctors/${userData.id}/stats`);
        setStatsData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const doctorId = userData.id;
        const res = await api.get(`/doctors/${doctorId}/appointments/today`);
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (userData?.id) {
      fetchDashboardStats();
      fetchAppointments();
    }
  }, []);

  const stats = statsData || [];

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 h-screen overflow-y-auto scrollbar-hide">
      {/* Header */}
      <h3 className="text-2xl md:text-3xl font-bold font-serif">Dashboard</h3>
      <p className="text-gray-700 py-2 font-sans text-base md:text-lg">
        Welcome back, Dr. <span className="font-medium">{userData?.name}</span>
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {stats.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">
            Loading stats...
          </p>
        ) : (
          stats.map((stat, index) => (
            <Card key={index} title={stat.title} value={stat.value} />
          ))
        )}
      </div>

      {/* Appointments Table */}
      <div className="my-6">
        <h2 className="text-xl md:text-2xl font-semibold">
          Today's Appointments
        </h2>

        <div className="mt-4 overflow-x-auto rounded-lg shadow-sm bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="text-left text-gray-500 font-light sticky top-0 bg-white z-10 border-b">
              <tr>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No appointments scheduled today
                  </td>
                </tr>
              ) : (
                appointments.map((appt, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 whitespace-nowrap">{appt.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{appt.date}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{appt.time}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{appt.type}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : appt.status === "Ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;

