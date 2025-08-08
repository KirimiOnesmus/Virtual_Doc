
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineDownload } from "react-icons/md";
import axios from "axios";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setPatient(res.data);
      } catch (error) {
        console.error("Failed to fetch patient details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/prescriptions/patient/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setPrescriptions(res.data);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      }
    };

    fetchPatientDetails();
    fetchPrescriptions();
  }, [id]);

  if (loading) return <div className="p-6">Loading patient details...</div>;
  if (!patient)
    return <div className="p-6 text-red-500 text-center">Patient not found.</div>;

  return (
    <div className="w-full px-4  md:px-6 py-4 mt-8">
      <div className="flex flex-col md:flex-row gap-4 md:h-[80vh]">
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-4 md:w-1/4 flex flex-col items-center justify-start">
          <img
            src={patient.avatar ? `http://localhost:8080${patient.avatar}` : "/default-avatar.png"}
            alt="profile"
            className="w-32 h-32 object-cover rounded-full mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
          <h1 className="text-lg font-semibold text-center">{patient.name}</h1>
          <p className="text-sm text-gray-500 text-center">{patient.email}</p>
          <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all">
            Download Patient
          </button>
        </div>

        {/* Details Section */}
        <div className="bg-white shadow-md rounded-lg p-4 flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Gender</p>
              <span>{patient.gender || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">Birthday</p>
              <span>{patient.date_of_birth?.split("T")[0] || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <span>{patient.phonenumber || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">City</p>
              <span>{patient.city || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">Member Status</p>
              <span>{patient.membership_status || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">Registered</p>
              <span>{patient.registerDate?.split("T")[0] || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">Allergies</p>
              <span>{patient.allergies || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">Current Medication</p>
              <span>{patient.current_medication || "N/A"}</span>
            </div>
            <div>
              <p className="text-gray-500">Condition</p>
              <span>{patient.existing_condition || "N/A"}</span>
            </div>
            <div className="col-span-2 md:col-span-3">
              <p className="text-gray-500">Emergency Contact</p>
              <span>{patient.emergency_name} - {patient.emergency_contact}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-1">Patient Note:</h3>
            <p className="text-sm text-gray-700">
              {patient?.treatments?.[0]?.notes || "No recent notes available."}
            </p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white shadow-md mb-12 rounded-lg p-4 md:mb-0 md:w-1/4 flex flex-col">
          <h3 className="text-md font-medium mb-2">Prescriptions & Notes</h3>
          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {prescriptions.length === 0 ? (
              <p className="text-sm text-gray-500">No prescriptions found.</p>
            ) : (
              prescriptions.map((item) => (
                <div key={item.appointment_id} className="text-sm">
                  <p>
                    With Dr. {item.doctor_name} on{" "}
                    {new Date(item.date).toLocaleDateString()} ({item.mode})
                  </p>
                  <a
                    href={`http://localhost:8080/api/prescriptions/${item.appointment_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <MdOutlineDownload /> PDF
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
