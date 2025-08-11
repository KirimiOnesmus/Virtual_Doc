import React, { useState, useEffect } from "react";
import { LuCalendarCheck } from "react-icons/lu";
import { CgDetailsMore } from "react-icons/cg";
import "react-datepicker/dist/react-datepicker.css";
import ScheduleAppointment from "../../components/Appiontments/ScheduleAppointment";
import DoctorDetails from "../../components/Doctor/DoctorDetails";
import api from "../../config/api";
import { useSearchParams } from "react-router-dom";

const Doctors = () => {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookAppointment, setBookAppointment] = useState(null);
  const [searchParams] = useSearchParams();
  const BASE_URL = "https://virtualdoc-server.onrender.com";

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);
      } catch (error) {
        console.error("Failed to fetch the doctors", error);
      }
    };
    fetchDoctors();

    const specialtyFromURL = searchParams.get("specialty");
    if (specialtyFromURL) {
      setSelectedSpecialty(specialtyFromURL.trim());
    }
  }, [searchParams]);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedSpecialty === "ALL" || doctor.specialty === selectedSpecialty)
  );

  return (
    <div className="relative px-2 py-4 bg-gray-50 overflow-hidden min-h-screen shadow-sm">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Doctors</h2>

        {/* Search bar: hidden on small screens */}
        <input
          type="text"
          placeholder="Search Doctor"
          className="border py-2 px-4 rounded-lg w-full md:w-64 outline-none focus:border-blue-500 hidden md:block"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mobile: Specialty dropdown */}
      <div className="md:hidden mb-4">
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full border py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {["ALL", ...new Set(doctors.map((doc) => doc.specialty))].map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* Desktop: Specialty buttons */}
      <div className="hidden md:flex flex-wrap gap-2 mb-4 border-b-2 border-black pb-2">
        {["ALL", ...new Set(doctors.map((doc) => doc.specialty))].map(
          (category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md text-sm whitespace-nowrap ${
                selectedSpecialty === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedSpecialty(category)}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md p-2 overflow-auto  max-h-[calc(100vh-10rem)] bg-gray-100">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 bg-white rounded-md shadow-md flex flex-col items-center space-y-3 hover:cursor-pointer hover:bg-blue-50 hover:shadow-lg transition-all duration-300"
            >
              <img
                src={`${BASE_URL}${doctor.avatar}`}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                <p className="text-gray-600 text-sm">{doctor.address}</p>
                <span className="text-sm bg-blue-100 text-blue-800 px-4 py-1 rounded-md font-medium">
                  {doctor.specialty}
                </span>
              </div>

              <div className="flex justify-around w-full pt-2 border-t">
                <button
                  className="flex items-center gap-1 text-sm hover:text-blue-500 px-2 py-1"
                  onClick={() => setBookAppointment(doctor)}
                >
                  <LuCalendarCheck />
                  Book
                </button>
                <button
                  className="flex items-center gap-1 text-sm hover:text-blue-500 px-2 py-1"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CgDetailsMore className="text-lg" />
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No Doctor Found
          </p>
        )}
      </div>

      {/* Book Appointment Modal */}
      {bookAppointment && (
        <ScheduleAppointment
          doctor={bookAppointment}
          onClose={() => setBookAppointment(null)}
        />
      )}

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};

export default Doctors;
