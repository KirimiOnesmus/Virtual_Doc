import React, { useState, useEffect } from "react";
import axios from "axios";
const DoctorRegistration = () => {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const isAuthorized =
    user && (user.role === "super-admin" || user.role === "admin");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/register-doctor",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(res.data.message || "Doctor registered successfully");
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage("An error occurred during registration");
      console.error("Registration error:", error);
    }
  };
  if (!isAuthorized) {
    return (
      <div className="text-red-500">
        You are not authorized to access this page
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Register New Doctor</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          className="w-full p-2 border rounded mb-2"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Doctor Email"
          className="w-full p-2 border rounded mb-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-white hover:text-blue-500 border border-blue-500 transition-colors duration-500"
        >
          Register Doctor
        </button>
      </form>
    </div>
  );
};

export default DoctorRegistration;
