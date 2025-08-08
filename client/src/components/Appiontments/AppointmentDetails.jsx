import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";

const AppointmentDetails = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [documents, setDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const appointment = event.extendedProps ?? {};
  const patient = appointment.patient ?? {};
  const doctor = appointment.doctor ?? {};

  const tabs = [
    "Basic Info",
    "Treatment Timeline",
    "Prescriptions",
    "Document",
  ];

  const [formData, setFormData] = useState({
    diagnosis: "",
    prescription: " ",
    notes: " ",
  });

  useEffect(() => {
    const patientId = appointment.patient?.id;

    const fetchAppointmets = async () => {
      if (!patientId) return;
      try {
        const res = await axios.get(
          `
          http://localhost:8080/api/appointments/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setTimeline(res.data);
        console.log("Overall appointment:", res.data);
      } catch (error) {
        console.log("Failed to fetch patient timeline:", error);
      }
    };
    fetchAppointmets();
  }, []);

  const appointmentId = appointment?.id;
  const patientId = appointment.patient?.id;
  const doctorId = appointment.doctor?.id;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/treatment/add",
        {
          appointment_id: appointmentId,
          doctor_id: doctorId,
          patient_id: patientId,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      alert("Prescription Sent!");
      setActiveTab("document");
      if (typeof onClose === "function") {
        onClose({ updated: true });
      }
      setFormData({
        diagnosis: " ",
        prescription: " ",
        notes: " ",
      });
    } catch (error) {
      console.log("Error sending prescription", error);
      alert("Failed to send prescription..!");
    }
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/prescriptions/${appointmentId}`
        );
        setDocuments(res.data);
      } catch (error) {
        console.log("Error fetching documents:", error);
      }
    };
    fetchDocs();
  }, [appointmentId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/prescriptions/${appointmentId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Failed to download");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `prescription_${appointmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Error downloading prescription");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
      />

      {/* Modal Panel */}
      <div className="fixed top-0 right-0 w-full md:w-[70%] h-full bg-white z-50 overflow-y-auto shadow-xl p-6 animate-slideInRight">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/men/36.jpg"
              alt="Profile"
              className="w-14 h-14 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {patient.name ?? "patient"}
              </h2>
              <p className="text-sm text-gray-500">
                {patient.email ?? "No email available"}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={onClose}
              className="text-3xl text-gray-500 hover:text-red-500"
            >
              <IoCloseOutline />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4 border-b text-sm font-medium text-gray-500 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`mr-4 pb-2 whitespace-nowrap ${
                activeTab === tab.toLowerCase()
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "basic info" && (
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 ">
                <p className="flex flex-col">
                  <strong>Age:</strong> {patient.age ?? "Null"}
                </p>
                <p className="flex flex-col">
                  <strong>Gender:</strong> {patient.gender ?? " "}
                </p>
                <p className="flex flex-col">
                  <strong>Phone:</strong> {patient.phone}
                </p>
                <p className="flex flex-col">
                  <strong>Address:</strong> {patient.address}, {patient.county}
                </p>
                <p className="flex flex-col">
                  <strong>Insurance:</strong>
                  {patient.insurance}
                </p>
                <p className="flex flex-col">
                  <strong>Allergies:</strong> {patient.allergies}
                </p>
                <p className="flex flex-col">
                  <strong>Blood Group:</strong> {patient.blood_group}
                </p>
                <p className="flex flex-col">
                  <strong>Current Medication:</strong>{" "}
                  {patient.current_medication}
                </p>
                <p className="flex flex-col">
                  <strong>Any Recurring Medical Condtion:</strong>{" "}
                  {patient.existing_condition}
                </p>
              </div>
              <div>
                <h2 className="py-2 font-semibold text-lg">Medical History:</h2>
                <p>{patient.medical_history ?? "No History provided"}</p>
              </div>
            </div>
          )}

          {activeTab === "treatment timeline" && (
            <>
              {/* Scrollable Table */}
              <div className="overflow-x-auto max-h-[400px] border rounded-md">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-4 ">Date</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Treatment</th>
                      <th className="p-4">Doctor</th>
                      <th className="p-4 ">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeline.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          item.isActive ? "bg-green-50" : ""
                        } border-b hover:bg-gray-50`}
                      >
                        <td className="p-4">{item.date}</td>
                        <td className="p-4">{item.time}</td>
                        <td className="p-4">{item.treatment}</td>
                        <td className="p-4">Dr. {item.doctor}</td>
                        <td className="py-4">
                          {item.isActive ? (
                            <span className="text-green-600 font-semibold">
                              Ongoing
                            </span>
                          ) : (
                            <span className="text-gray-400">Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "prescriptions" && (
            <div className="space-y-2">
              <div className="py-2 px-4 rounded-md">
                <h4 className="font-semibold">Prescriptions</h4>
                <form onSubmit={handleSubmit}>
                  {/* <div>
                    <label htmlFor="name">Patient Name</label>
                    <input type="text" 
                      className="w-full p-2 border rounded-md mt-1 outline-none focus:border-blue-500"
                      placeholder=""
                     />
                  </div> */}
                  <div>
                    <label htmlFor="diagnosis">Diagnosis</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md mt-1 outline-none focus:border-blue-500"
                      placeholder="Diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="medication">Medication</label>
                    <textarea
                      name="prescription"
                      value={formData.prescription}
                      onChange={handleChange}
                      id="medication"
                      className="w-full p-2 border rounded-md mt-1 outline-none focus:border-blue-500"
                      placeholder="List of medications..e.g. Amoxicillin 500mg, twice daily for 7 days"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="instructions">Instructions</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      id="instructions"
                      className="w-full p-2 border rounded-md mt-1 outline-none focus:border-blue-500"
                      placeholder="eg. Take with food, avoid dairy products, etc."
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="text-white bg-blue-500 p-2 rounded-md mt-2
                     hover:bg-white hover:text-blue-500 hover:border border-blue-500"
                    >
                      Send Prescription
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "document" && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold mb-4">Documents</h2>
              <div className="flex justify-between items-center border p-4 rounded-md">
                <span className="text-gray-700">
                  Prescription for Appointment #{appointmentId}
                </span>
                <button
                  onClick={handleDownload}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentDetails;
