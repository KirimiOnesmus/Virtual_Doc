import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import avatar from "../../assests/profile-photo.png";
import api from "../../config/api";

const ProfilePage = () => {
  const { userId } = useParams();
  const [role, setRole] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone_number: "",
    specialization: "",
    role: "",
  });

  const [formData, setFormData] = useState({
    avatar: null,
    name: "",
    email: "",
    phonenumber: "",
    gender: "",
    bio: "",
    address: "",
    county: "",
    license_number: "",
    years_of_experience: "",
    affiliation: "",
    specialty: "",
    date_of_birth: "",
    insurance: "",
    policy_number: "",
    allergies: "",
    blood_group: "",
    current_medication: "",
    existing_condition: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_contact: "",
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        const userRole = data.role;

        const source = userRole === "doctor" ? data.doctor : data.patient;
        // Common Fields
        const commonFields = {
          name: data.name || "",
          email: data.email || "",
          phonenumber: source?.phonenumber || "",
          gender: source?.gender || "",
          address: source?.address || "",
          county: source?.county || "",
          bio: source?.bio || "",
        };
        console.log("Fetched profile data:", data);
        const formatDate = (isoDate) => {
          if (!isoDate) return "";
          return new Date(isoDate).toISOString().split("T")[0]; // "2001-04-25"
        };

        // Role-specific fields
        let roleSpecificFields = {};

        if (userRole === "doctor") {
          roleSpecificFields = {
            specialty: data.doctor?.specialty || "",
            license_number: data.doctor?.license_number || "",
            years_of_experience: data.doctor?.years_of_experience || "",
            affiliation: data.doctor?.affiliation || "",
          };
        }

        if (userRole === "patient") {
          roleSpecificFields = {
            date_of_birth: formatDate(data.patient?.date_of_birth) || "",
            insurance: data.patient?.insurance || "",
            policy_number: data.patient?.policy_number || "",
            allergies: data.patient?.allergies || "",
            blood_group: data.patient?.blood_group || "",
            current_medication: data.patient?.current_medication || "",
            existing_condition: data.patient?.existing_condition || "",
            emergency_name: data.patient?.emergency_name || "",
            emergency_relationship: data.patient?.emergency_relationship || "",
            emergency_contact: data.patient?.emergency_contact || "",
          };
        }

        setFormData({
          ...commonFields,
          ...roleSpecificFields,
          avatar: null,
        });

        setRole(userRole);
        setProfileData({
          fullName: data.name,
          email: data.email,
          specialization: data.doctor?.specialty || "",
          role: userRole,
        });
        setAvatarPreview(data.avatar || avatar);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      if (formData.avatar instanceof File) {
        form.append("avatar", formData.avatar);
      }
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "avatar") form.append(key, value);
      });

      await api.put("/users/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed", error);
      alert("Profile update failed");
    }
  };

  return (
    <div className="max-h-screen overflow-y-auto scrollbar-hide">
      <div className="header flex flex-row justify-between items-start md:items-center px-4 gap-4">
        <h3 className="md:mx-6 my-2 text-xl  md:text-2xl font-bold text-gray-400 flex items-center gap-2">
          {formData.name}'s Profile
        </h3>
        <button
          type="submit"
          onClick={handleSubmit}
          className="button flex gap-2 mt-2 items-center bg-blue-500 rounded-full py-1 md:py-2 px-4 md:px-6 text-white font-semibold text-xl
            hover:text-blue-500 hover:bg-white hover:border border-blue-500 
          "
        >
          Save
          <span className="hidden md:flex">
            <FaArrowRight />
          </span>
        </button>
      </div>
      <div className="profile-container grid gap-4  my-4 px-4 py-6 overflow-y-auto ">
        <div className="profile-pic flex flex-col  md:flex-row items-center md:items-start gap-6 text-xl">
          <div className=" text-center">
            {/* Hidden file input */}
            <input
              type="file"
              name="avatar"
              id="avatarUpload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData((prev) => ({
                    ...prev,
                    avatar: file,
                  }));
                  setAvatarPreview(URL.createObjectURL(file)); 
                }
              }}
            />

            {/* Clickable avatar image triggers file input */}
            <label htmlFor="avatarUpload" className="cursor-pointer">
              <img
                src={
                  formData.avatar instanceof File
                    ? URL.createObjectURL(formData.avatar) 
                    : avatarPreview?.startsWith("http")
                    ? avatarPreview
                    : `http://localhost:8080${avatarPreview}`
                }
                alt="Avatar"
                title="Change Profile"
                className="w-32 h-32 rounded-full mx-auto mb-2 object-cover ring-1 ring-blue-300 hover:opacity-80 transition-opacity duration-200"
              />
            </label>
          </div>
          <div className="name flex flex-col items-center justify-center ">
            <p className="font-semibold flex ">
              <span>{profileData.role === "doctor" ? "Dr." : ""}</span>{" "}
              {profileData.fullName}{" "}
            </p>
            <span className="font-thin text-blue-600 text-lg italic">
              {profileData.specialization}
            </span>
            <p className="text-lg font-light text-gray-600">
              {profileData.email}
            </p>
            <button className="flex items-center gap-2 border px-2 py-1 text-base font-semibold rounded shadow-md">
              {" "}
              <span>
                <MdPassword />
              </span>{" "}
              Change Password
            </button>
          </div>
        </div>
        <div className="edit-info my-6">
          <h3 className="font-bold text-xl my-2 border-b py-2 border-black">
            Edit Personal Details:
          </h3>
          <div className="personal-details grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="name grid w-full gap-2">
              <label htmlFor="fullname" className="font-semibold text-lg">
                Full Name:
              </label>
              <input
                type="text"
                name="full_name"
                id=""
                value={formData.name}
                onChange={handleChange}
                className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
              />
            </div>
            <div className="gender grid w-full">
              <label htmlFor="gender" className="font-semibold text-lg">
                Gender:
              </label>
              <select
                name="gender"
                id=""
                value={formData.gender}
                onChange={handleChange}
                className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
              >
                <option value="">Select Your Gender</option>
                <option value="male" className="male">
                  Male
                </option>
                <option value="female" className="female">
                  Female
                </option>
              </select>
            </div>
            <div className="phone-number grid w-full">
              <label htmlFor="phone number" className="font-semibold text-lg">
                Phone Number:
              </label>
              <input
                type="tel"
                name="phonenumber"
                id="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
              />
            </div>
            <div className="mail grid w-full">
              <label htmlFor="email" className="font-semibold text-lg">
                Email Address:
              </label>
              <input
                type="email"
                name="email"
                id="mail"
                value={formData.email}
                onChange={handleChange}
                className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
              />
            </div>
            <div className="address grid w-full">
              <label htmlFor="address" className="font-semibold text-lg">
                Address:
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
                placeholder="P.O Box 0"
              />
            </div>
            <div className="county grid w-full">
              <label htmlFor="county" className="font-semibold text-lg">
                County:
              </label>
              <input
                type="text"
                name="county"
                id="county"
                value={formData.county}
                onChange={handleChange}
                className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
                placeholder="Nairobi"
              />
            </div>

            {/*---------------------------To reflect when the user is a patient---------------------------------*/}
            {role === "patient" && (
              <div className="data-of-birth grid w-full">
                <label
                  htmlFor="date-of-birth"
                  className="font-semibold text-lg"
                >
                  Date of Birth:
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData.date_of_birth || ""}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
                  placeholder="24/10/2024"
                />
              </div>
            )}
            {role === "patient" && (
              <div className="insurance grid w-full">
                <label htmlFor="insurance" className="font-semibold text-lg">
                  Insurance:
                </label>
                <input
                  type="text"
                  name="insurance"
                  id="insurance"
                  value={formData.insurance}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
                  placeholder="Maddison Insurance"
                />
              </div>
            )}

            {role === "patient" && (
              <div className="policy-number grid w-full">
                <label htmlFor="policynumber" className="font-semibold text-lg">
                  Policy-Number:
                </label>
                <input
                  type="text"
                  name="policy_number"
                  id="policy_number"
                  value={formData.policy_number}
                  onChange={handleChange}
                  className="outline-none uppercase bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
                  placeholder="PD-drsjiw-q-12k-we"
                />
              </div>
            )}
          </div>
        </div>

        {/* To reflect if the user is a doctor */}

        {role === "doctor" && (
          <div className="proffessional-info my-6">
            <h3 className="font-bold text-xl my-2 border-b py-2 border-black">
              Proffessional Information:
            </h3>
            <div className="proff-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="medical-license grid w-full gap-2">
                <label htmlFor="license" className="font-semibold text-lg">
                  Medical License Number:
                </label>
                <input
                  type="text"
                  name="license_number"
                  id=""
                  value={formData.license_number}
                  onChange={handleChange}
                  className="outline-none uppercase bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                  placeholder="12WDDFI1ICN"
                />
              </div>
              <div className="specialization grid">
                <label htmlFor="specialization" className="text-xl font-bold">
                  Specialization:
                </label>
                <input
                  name="specialty"
                  id=""
                  value={formData.specialty}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                />
              </div>
              <div className="year-of-practice grid w-full gap-2">
                <label htmlFor="year-of-practice" className="text-xl font-bold">
                  Years of Experience:
                </label>
                <input
                  type="number"
                  name="years_of_experience"
                  id=""
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  placeholder="10"
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                />
              </div>
              <div className="affliations grid w-full gap-2">
                <label htmlFor="affiliation" className="text-xl font-bold">
                  Affiliation:
                </label>
                <input
                  type="text"
                  placeholder="World Health Organization"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                />
              </div>
            </div>
          </div>
        )}

        {/* --------End of doctor professional info-------- */}
        {/* ------------Patient medical information----------------- */}

        {role === "patient" && (
          <div className="medical-info my-6">
            <h3 className="font-bold text-xl my-2 border-b py-2 border-black">
              Medical Details:
            </h3>
            <div className="proff-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="allergies grid w-full gap-2">
                <label htmlFor="allergies" className="font-semibold text-lg">
                  Allergies:
                </label>
                <input
                  type="text"
                  name="allergies"
                  id=""
                  value={formData.allergies}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                  placeholder=""
                />
              </div>
              <div className="blood_group grid">
                <label htmlFor="blood_group" className="text-xl font-semibold">
                  Blood Group:
                </label>
                <select
                  name="blood_group"
                  id=""
                  value={formData.blood_group}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                >
                  <option
                    value=""
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    Select Your Field
                  </option>
                  <option
                    value="A+"
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    A+
                  </option>
                  <option
                    value="A-"
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    A-
                  </option>
                  <option
                    value="B+"
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    B+
                  </option>
                  <option
                    value="B-"
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    B-
                  </option>
                  <option
                    value="O+"
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    O+
                  </option>
                  <option
                    value="O-"
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    O-
                  </option>
                  <option
                    value="AB"
                    className="p-2 w-full outline-none border-b rounded font-semibold text-xl bg-slate-100"
                  >
                    AB
                  </option>
                </select>
              </div>
              <div className="current-medication grid w-full gap-2">
                <label
                  htmlFor="current_medication"
                  className="text-xl font-bold"
                >
                  Current Medication:
                </label>
                <input
                  type="text"
                  name="current_medication"
                  id=""
                  value={formData.current_medication}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                />
              </div>
              <div className="existing_condition grid w-full gap-2">
                <label
                  htmlFor="existing_condition"
                  className="text-xl font-bold"
                >
                  Existing Condition:
                </label>
                <input
                  type="text"
                  id=""
                  placeholder="Asthma"
                  value={formData.existing_condition}
                  onChange={handleChange}
                  name="existing_condition"
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                />
              </div>
            </div>
          </div>
        )}

        {/* ---emergency contact------------- */}
        {role === "patient" && (
          <div className="emergency-info my-6">
            <h3 className="font-bold text-xl my-2 border-b py-2 border-black">
              Emergency Contact:
            </h3>
            <div className="proff-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="emergency_name grid w-full gap-2">
                <label
                  htmlFor="emergency_name"
                  className="font-semibold text-lg"
                >
                  Name:
                </label>
                <input
                  type="text"
                  name="emergency_name"
                  id=""
                  value={formData.emergency_name}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                  placeholder="John Doe"
                />
              </div>
              <div className="emergency_relationship grid w-full gap-2">
                <label
                  htmlFor="emergency_relationship"
                  className="text-xl font-bold"
                >
                  Relationship:
                </label>
                <input
                  type="text"
                  name="emergency_relationship"
                  id=""
                  value={formData.emergency_relationship}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                  placeholder="Father"
                />
              </div>
              <div className="emergency_contact grid w-full gap-2">
                <label
                  htmlFor="emergency_contact"
                  className="text-xl font-bold"
                >
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id=""
                  placeholder="0712345678"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="outline-none bg-gray-100 w-full p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600 "
                />
              </div>
            </div>
          </div>
        )}

        {/* -----------------end of patients information--------- */}
        <div className="bio my-4 w-full px-2">
          <h3 className="font-bold text-xl my-2 border-b py-2 border-black">
            {role === "patient"
              ? "Medical History"
              : "Personal Bio (Professional History)"}
          </h3>
          <div className="text-area w-full">
            <textarea
              name="bio"
              id=""
              col={4}
              rows={4}
              required
              value={formData.bio}
              onChange={handleChange}
              className="w-full outline-none bg-gray-100 p-2 border-b border-black rounded-sm focus:border-b-2 focus:border-blue-600"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
