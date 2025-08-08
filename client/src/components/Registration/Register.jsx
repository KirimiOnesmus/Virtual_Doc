
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Doctor from "../../assests/doctor3.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdHome } from "react-icons/md";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
  });

  const togglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: "patient",
    };
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("User Registered Successfully!!", data);
        navigate("/login");
      } else {
        setError(data.message || "Registration Failed !");
      }
    } catch (error) {
      console.log("Oops Failed:", error);
      setError("Something went wrong, please try again later!!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl md:flex md:justify-between border rounded-xl shadow-lg bg-white overflow-hidden">
        
        {/* Left Image Section */}
        <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-blue-50 items-center justify-center p-4">
          <img
            src={Doctor}
            alt="Doctor"
            className="w-full max-w-xs lg:max-w-sm object-contain"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-3xl font-bold text-blue-500">CREATE ACCOUNT</h2>
            <h4 className="py-2 text-xl font-semibold">Welcome To Virtual Doc.</h4>
            <p className="text-lg md:text-xl">
              Where Doctors and Patients meet online. Your Health is Our Priority.
            </p>
            {error && <p className="text-red-600 font-semibold py-2">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-bold mb-1">Full Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full p-2 border rounded-lg bg-slate-100 font-semibold text-lg outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="johndoe@gmail.com"
                className="w-full p-2 border rounded-lg bg-slate-100 font-semibold text-lg outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-1">Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+254712345678"
                className="w-full p-2 border rounded-lg bg-slate-100 font-semibold text-lg outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div className="relative">
              <label className="block text-lg font-bold mb-1">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg bg-slate-100 font-semibold text-lg outline-none focus:ring-1 focus:ring-blue-400"
              />
              <span
                onClick={togglePassword}
                className="absolute top-11 right-4 cursor-pointer"
              >
                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition duration-200"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-lg">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
          <div className="flex fixed bottom-8 right-4 p-3 rounded-full bg-blue-500 text-white text-2xl hover:bg-white hover:text-blue-500 border transition duration-200">
              <a href="/">
                <MdHome />
              </a>
            </div>
    </div>
  );
};

export default Register;
