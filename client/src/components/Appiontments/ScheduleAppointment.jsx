
import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import api from "../../config/api";

const ScheduleAppointment = ({ onClose, doctor }) => {
  const [department, setDepartment] = useState(doctor?.specialty || "");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [consultationType, setConsultationType] = useState("");
    const BASE_URL = "https://virtualdoc-server.onrender.com";

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get(`/schedule/available/${doctor.id}`);
        const sortedSlots = response.data
          .filter((slot) => new Date(slot.start_time) > new Date())
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        setAvailableTimeSlots(sortedSlots);
      } catch (error) {
        console.error("Failed to fetch time slots:", error);
      }
    };

    if (doctor?.id) {
      fetchSlots();
    }
  }, [doctor?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      doctorId: doctor.id,
      department,
      timeSlot,
      symptoms,
      consultationType,
    };

    try {
      await api.post("/appointments", payload);

      alert("Appointment Booked Successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while booking appointment!");
    }
  };

  return (
    <>
      {/* Background overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
      />

      {/* Right-side modal */}
      <div className="fixed top-0 right-0 w-full sm:w-[80%] md:w-[50%] lg:w-[40%] h-full bg-white z-50 overflow-y-auto shadow-xl p-6 animate-slideInRight">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="font-mono font-semibold text-xl sm:text-2xl">
            Schedule Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-2xl sm:text-3xl text-gray-500 hover:text-red-500"
          >
            <IoCloseOutline />
          </button>
        </div>

        {/* Doctor Card */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm mb-6">
          <img
            src={`${BASE_URL}${doctor.avatar}`}
            alt="Doctor Avatar"
            className="rounded-full w-16 h-16 sm:w-24 sm:h-24 object-cover"
          />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{doctor?.name}</h3>
            <p className="text-gray-600 text-sm">Specialty: {doctor?.specialty}</p>
            <p className="text-gray-600 text-sm">
              Address: {doctor?.address || "Nairobi, Kenya"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Department */}
          <div className="flex flex-col">
            <label htmlFor="department" className="font-semibold mb-1">
              Department:
            </label>
            <select
              id="department"
              value={department}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
              disabled
            >
              <option>{department}</option>
            </select>
          </div>

          {/* Time Slot */}
          <div className="flex flex-col">
            <label htmlFor="timeslot" className="font-semibold mb-1">
              Time Slot Available:
            </label>
            <select
              id="timeslot"
              name="timeSlot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Time Slot</option>
              {availableTimeSlots.map((slot, index) => {
                const start = new Date(slot.start_time.replace(" ", "T"));
                const end = new Date(slot.end_time.replace(" ", "T"));

                return (
                  <option key={index} value={slot.start_time}>
                    {start.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {end.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Symptoms */}
          <div className="flex flex-col">
            <label htmlFor="symptoms" className="font-semibold mb-1">
              Symptoms (Optional):
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms"
              className="w-full h-28 p-2 border rounded-md focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Consultation Type */}
          <div className="flex flex-col">
            <label htmlFor="consultation" className="font-semibold mb-1">
              Consultation Type:
            </label>
            <select
              id="consultation"
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="chat">Chat</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-all duration-300"
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-white hover:text-red-500 hover:border border-red-500 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ScheduleAppointment;
