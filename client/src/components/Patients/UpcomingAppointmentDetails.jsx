import React from "react";
import { IoClose } from "react-icons/io5";

const UpcomingAppointmentDetails = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-xl relative transition-all duration-300 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-5 font-sans">
          Appointment Overview
        </h2>

        {/* Doctor Info */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center border-b pb-4 mb-6">
          <img
            src={`http://localhost:8080${appointment.doctor?.avatar}`}
            alt="Doctor"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-blue-200 shadow-sm"
          />
          <div className="flex justify-between items-center w-full flex-wrap gap-2">
            <div>
              <p className="font-semibold text-base sm:text-lg text-gray-800">
                {appointment.doctor?.department || "General Medicine"}
              </p>
              <p className="text-blue-700 font-medium text-sm sm:text-base mt-1">
                Dr. {appointment.doctor?.name}
              </p>
            </div>
            <span
              className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${
                appointment.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {appointment.status}
            </span>
          </div>
        </div>

        {/* Appointment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm sm:text-base">
          <div>
            <p className="text-gray-500 mb-1">Date</p>
            <p className="font-medium">{appointment.date}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Time</p>
            <p className="font-medium">{appointment.time}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-500 mb-1">Consultation Mode</p>
            <p className="font-medium capitalize">
              {appointment.consultation_mode}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-white hover:text-red-500 hover:border border-red-500 transition-all"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointmentDetails;
