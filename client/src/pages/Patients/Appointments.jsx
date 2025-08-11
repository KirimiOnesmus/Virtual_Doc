
import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import ViewAppointmeDetail from "../../components/Appiontments/ViewAppointmeDetail";
import UpcomingAppointmentDetails from "../../components/Patients/UpcomingAppointmentDetails";

const Appointments = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [appointments, setAppointments] = useState({
    upcoming: [],
    completed: [],
    cancelled: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const role = sessionStorage.getItem("role");
  const BASE_URL = "https://virtualdoc-server.onrender.com";
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      try {
        const res = await api.get(`/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const upcoming = res.data.filter(
          (a) => a.status === "pending" || a.status === "confirmed"
        );
        const completed = res.data.filter((a) => a.status === "completed");
        const cancelled = res.data.filter((a) => a.status === "cancelled");

        setAppointments({ upcoming, completed, cancelled });
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = (appointments[selectedTab] || []).filter((a) =>
    (role === "doctor" ? a.patient?.name : a.doctor?.name)
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment.id);
    setModalType("details");
    setShowModal(true);
  };

  const handleUpcomingAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType("upcoming");
    setShowModal(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    const token = sessionStorage.getItem("token");
    const id = typeof appointmentId === "object" ? appointmentId.id : appointmentId;

    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      await api.patch(
        `/appointments/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments((prev) => ({
        ...prev,
        upcoming: prev.upcoming.filter((a) => a.id !== id),
        cancelled: [
          ...prev.cancelled,
          { ...selectedAppointment, status: "cancelled" },
        ],
      }));

      if (modalType === "upcoming") {
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert("Error cancelling appointment.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500 text-lg">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="relative px-2 md:px-4">
      <h2 className="font-mono font-bold text-2xl sm:text-3xl">Appointments</h2>
      <p className="text-gray-500 font-serif text-base sm:text-lg py-2">
        Manage your upcoming and past appointments.
      </p>

      {/* Tabs */}
      <div className="flex border-b pt-2 space-x-2 sm:space-x-4 md:space-x-6 text-sm sm:text-base">
        {["upcoming", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 capitalize transition-all duration-200 ${
              selectedTab === tab
                ? `border-b-2 ${
                    tab === "cancelled" ? "border-red-500" : "border-blue-500"
                  } font-bold`
                : "text-gray-600"
            }`}
            onClick={() => {
              setSelectedTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <input
        type="search"
        placeholder="Search by Doctor's name"
        className="w-full mt-3 p-2 text-sm sm:text-base bg-gray-100 border rounded-md outline-none focus:border-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Appointment List */}
      <div className="overflow-hidden w-full px-1 sm:px-2 md:px-4 h-[70vh] overflow-y-auto scrollbar-hide mt-2">
        {currentAppointments.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No appointments to show.
          </div>
        ) : (
          currentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-2 sm:p-3 md:p-4 border rounded mb-2 shadow-sm flex justify-between items-center hover:bg-gray-100"
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2 sm:gap-4">
                  <img
                    src={`${BASE_URL}${appointment.doctor?.avatar}`}
                    alt="Doctor Avatar"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="flex text-sm sm:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                      <p>{appointment.date}</p>, <p>{appointment.time}</p>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-blue-600">
                      {appointment.doctor?.name},{" "}
                      <span className="italic text-gray-500 text-xs sm:text-sm">
                        {appointment.doctor?.department}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                  {selectedTab === "upcoming" && (
                    <>
                      <button
                        onClick={() => handleUpcomingAppointment(appointment)}
                        className="text-white text-sm rounded-lg bg-blue-500 px-2 py-1 sm:px-4 sm:py-2 hover:text-blue-500 hover:bg-white border border-blue-500 transition-all duration-300"
                        title="View Appointment Details"
                      >
                        <IoEyeOutline />
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment)}
                        className="text-white text-sm rounded-lg bg-red-500 px-2 py-1 sm:px-4 sm:py-2 hover:text-red-500 hover:bg-white border border-red-500 transition-all duration-300"
                        title="Cancel Appointment"
                      >
                        <MdOutlineFreeCancellation />
                      </button>
                    </>
                  )}
                  {selectedTab === "completed" && (
                    <button
                      className="text-white text-sm bg-blue-500 px-2 py-1 sm:px-4 sm:py-2 hover:text-blue-500 hover:bg-white hover:border border-blue-500 rounded-lg transition-all duration-300"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      View Full Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {currentAppointments.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm sm:text-base">
            <button
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white"
              disabled={
                currentPage * itemsPerPage >= filteredAppointments.length
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal Components */}
      {showModal && selectedAppointment && modalType === "details" && (
        <ViewAppointmeDetail
          appointmentId={selectedAppointment}
          onClose={() => {
            setShowModal(false);
            setModalType(null);
          }}
        />
      )}

      {showModal && selectedAppointment && modalType === "upcoming" && (
        <UpcomingAppointmentDetails
          appointment={selectedAppointment}
          onClose={() => {
            setShowModal(false);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
};

export default Appointments;
