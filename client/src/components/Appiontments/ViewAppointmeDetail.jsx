
import React, { useEffect, useState } from "react";
import { IoCloseOutline, IoPrintOutline } from "react-icons/io5";
import axios from "axios";

const ViewAppointmeDetail = ({ appointmentId, onClose }) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/appointments/details/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(res.data);
      } catch (error) {
        console.error("Failed to fetch appointment details", error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  const handleDownloadPDF = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/appointments/details/${appointmentId}?download=pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `appointment_with Dr.${appointment.doctor?.name} on ${appointment.date}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md text-sm sm:text-base">
          Loading appointment details...
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md text-sm sm:text-base">
          Appointment not found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
      ></div>

      <div className="fixed top-0 right-0 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] h-full bg-white z-50 overflow-y-auto shadow-xl px-4 sm:px-6 py-6 animate-slideInRight">
    
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-mono">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoCloseOutline className="text-2xl" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full overflow-hidden">
            <img
              src={`http://localhost:8080${appointment.doctor?.avatar}`}
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3 sm:ml-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Dr. {appointment.doctor?.name || "John Doe"}
            </h3>
            <p className="text-sm text-gray-600">{appointment.department}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base">
          <div>
            <h4 className="font-semibold mb-1">Appointment Information</h4>
            <div className="space-y-1 border rounded-md p-3 bg-gray-50">
              <p>
                <span className="font-medium">Date & Time:</span>{" "}
                {appointment.date}, {appointment.time}
              </p>
              <p>
                <span className="font-medium">Treatment:</span>{" "}
                {appointment.treatment || "Follow up on previous consultation"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="text-green-600">{appointment.status}</span>
              </p>
            </div>
          </div>


          <div>
            <h4 className="font-semibold mb-1">Notes</h4>
            <p className="border rounded-md p-3 bg-gray-50">
              {appointment.symptoms || "N/A"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Diagnosis</h4>
            <p className="border rounded-md p-3 bg-gray-50">
              {appointment.diagnosis || "N/A"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Prescription</h4>
            <p className="border rounded-md p-3 bg-gray-50">
              {appointment.prescription || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-white hover:text-blue-500 hover:border border-blue-600 transition-colors"
          >
            <IoPrintOutline className="text-xl" />
            Download
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewAppointmeDetail;
