import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Doctor from "../../assests/doctor3.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdHome } from "react-icons/md";
import {toast} from 'react-toastify'

import api from "../../config/api";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // phone: "",
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
  setLoading(true);
  setError(null);

if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter a password");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

  const dataToSend = {
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    role: "patient",
  };

  try {
 
    const response = await api.post("/auth/register", dataToSend);
    

    console.log("User Registered Successfully!!", response);
    toast.success("User Registered Successfully! Redirecting....",{
      position:"top-right",
      autoClose:1750,
    });
   
    setTimeout(() => {
      navigate("/login");
    }, 2000);
    
  } catch (error) {

     console.error("Registration error:", error);
      
      let errorMessage = "Registration failed! Please try again.";
      
      if (error.response) {
        // Server responded with error
        const serverMessage = error.response.data?.message;
        if (serverMessage) {
          errorMessage = serverMessage;
        }
        
        // Specific error messages
        if (error.response.status === 400) {
          if (serverMessage?.toLowerCase().includes('email')) {
            errorMessage = "Email already exists or is invalid";
          } else if (serverMessage?.toLowerCase().includes('password')) {
            errorMessage = "Password requirements not met";
          }
        }
        
        setError(errorMessage);
      } else if (error.request) {
        errorMessage = "Unable to connect to server. Please check your connection.";
        setError(errorMessage);
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
        setError(errorMessage);
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
  } finally {
    setLoading(false);
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
            <h4 className="py-2 text-xl font-semibold">
              Welcome To Virtual Doc.
            </h4>
            <p className="text-lg md:text-xl">
              Where Doctors and Patients meet online. Your Health is Our
              Priority.
            </p>
            {error && (
              <p className="text-red-600 font-semibold py-2">{error}</p>
            )}
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
                {showPassword ? (
                  <AiFillEyeInvisible size={22} />
                ) : (
                  <AiFillEye size={22} />
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition duration-200"
            >
              {loading ? "Registering..." : "Register"}
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
