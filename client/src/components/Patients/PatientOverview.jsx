import React, { useEffect, useState, useRef } from "react";
import avatar from "../../assests/Avatar.png";
import { CiVideoOn } from "react-icons/ci";
import { BsChatDots } from "react-icons/bs";
import profile from "../../assests/doctor3.png";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { specialtyIcons, fallbackIcons } from "../utils/iconMap";
import DoctorDetails from "../Doctor/DoctorDetails";

const PatientOverview = () => {
  const navigate = useNavigate();
  const { userData } = useOutletContext();
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [categories, setCategories] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const assignedIconsRef = useRef({});
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/patients/${userData.id}/upcoming-appointment`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUpcomingAppointment(res.data);
        console.log(res.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No upcoming appointment.");
          setUpcomingAppointment(null); // explicitly show no appointment
        } else {
          console.log("Failed to fetch upcoming appointment:", error);
        }
      }
    };
    if (userData?.id) fetchAppointments();

    //fetching specialties from the backend
    const fetchSpecialties = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/doctors/specialties"
        );
        setCategories(res.data.map((s) => s.trim()));
      } catch (error) {
        console.log("Failed to fetch specialties:", error);
      }
    };
    fetchSpecialties();

    //fetching doctors
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/doctors");
        setDoctors(res.data);
      } catch (error) {
        console.log("Failed to fetch doctors", error);
      }
    };
    fetchDoctors();
  }, [userData]);

  return (
    <div className="max-h-screen overflow-y-auto bg-white p-4 sm:px-6  md:px-8 scrollbar-hide">
      <h2 className="text-2xl md:text-4xl font-mono font-light">
        Hello{" "}
        <span className="font-semibold">{userData?.name || "Patient"}!</span>
      </h2>
      <p className="text-xl md:text-2xl font-medium text-gray-500 py-2">
        Welcome back 👋.
      </p>

      {/* Promo Banner */}
      <div className="relative bg-blue-500 rounded-xl md:p-6 mb-12 overflow-visible min-h-[12rem] md:h-52 flex items-center justify-between shadow-lg">
        <div className="relative z-10 px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Your Health is Our Priority!
          </h2>
          <p
            className=" md:px-4 text-white italics
      w-fit italic text-sm md:text-md md:max-w-96  "
          >
            "Better health begins with better choices. Let’s make them
            together—by staying informed, staying proactive, and embracing every
            step toward a healthier you."
          </p>
        </div>
        <img
          src={avatar}
          alt="Doctor"
          className="absolute hidden md:flex -bottom-8 right-4 md:w-56 h-60 border-none z-0"
        />
      </div>

      {/* Upcoming Appointment */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Upcoming Appointment</h3>
        <button
          className="text-md font-medium text-blue-600"
          onClick={() => navigate("/dashboard/appointments")}
        >
          See All
        </button>
      </div>
      {upcomingAppointment ? (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={
                  upcomingAppointment?.avatar
                    ? `${BASE_URL}${upcomingAppointment.avatar}`
                    : profile
                }
                alt="Doctor Profile"
                className="h-24 w-24 rounded-full"
              />
              <div>
                <p className="font-medium">{`Dr. ${upcomingAppointment.doctor}`}</p>
                <p className="text-sm text-gray-600">
                  {upcomingAppointment.specialization}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {`${upcomingAppointment.date} | ${upcomingAppointment.time}`}
                </p>
              </div>
            </div>
            {upcomingAppointment.consultation_mode?.toLowerCase() ===
            "video" ? (
              <button
                className="bg-blue-400 p-2 text-white rounded-full"
                onClick={() => window.open("/dashboard/video-call", "_blank")}
                title="Start Video Call"
              >
                <CiVideoOn className="text-2xl" />
              </button>
            ) : (
              <button
                className="bg-blue-400 p-2 text-white rounded-full"
                onClick={() => navigate("/dashboard/messages")}
                title="Start Chat"
              >
                <BsChatDots className="text-2xl" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            You have no upcoming appointments.
          </p>
        </div>
      )}

      {/* Categories */}
      <div className="mb-6 ">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Categories</h3>
          <button
            className="text-md font-medium text-blue-600"
            onClick={() => navigate("/dashboard/doctors")}
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm">No categories available.</p>
          ) : (
            categories.map((specialty, index) => {
              const normalized = specialty
                .toLowerCase()
                .replace(/\s+/g, "")
                .trim();
              let icon = specialtyIcons[normalized];

              if (!icon) {
                if (!assignedIconsRef.current[normalized]) {
                  const randomIndex = Math.floor(
                    Math.random() * fallbackIcons.length
                  );
                  assignedIconsRef.current[normalized] =
                    fallbackIcons[randomIndex];
                }
                icon = assignedIconsRef.current[normalized];
              }

              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between bg-blue-50 p-4 rounded-xl w-24 sm:w-32 cursor-pointer hover:bg-blue-100 transition-all duration-500"
                  onClick={() =>
                    navigate(
                      `/dashboard/doctors?specialty=${encodeURIComponent(
                        specialty
                      )}`
                    )
                  }
                >
                  {icon}
                  <p className="text-sm text-center">{specialty}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recommended Doctors */}
      <div className="mb-6 ">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Our Doctors</h3>
          <button
            className="text-md font-medium text-blue-500"
            onClick={() => navigate("/dashboard/doctors")}
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.length === 0 ? (
            <p className="text-gray-400 text-sm">No doctors available</p>
          ) : (
            doctors.slice(0, 4).map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className="bg-white border rounded-xl p-4 shadow-sm flex items-center space-x-4 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={doctor.avatar ? `${BASE_URL}${doctor.avatar}` : profile}
                  alt={doctor.name}
                  className="rounded-full w-16 h-16 object-cover"
                />
                <div>
                  <h4 className="font-medium">{doctor.name}</h4>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        doctor.is_online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {doctor.is_online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedDoctor && (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onBook={(id) => {
            setSelectedDoctor(null);
            navigate(`/dashboard/book/${id}`);
          }}
        />
      )}
    </div>
  );
};

export default PatientOverview;
