import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import patient from "../../assests/patient.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdHome } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });

      const { token, user } = response.data;
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", user.role);
      sessionStorage.setItem("userId", user.id);
      setTimeout(() => {
        navigate(`/dashboard?role=${user.role}`);
      }, 2000);

      toast.success("Welcome Back...!!");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      toast.error("Login Failed ...!!");
    }
    finally{
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl md:flex md:justify-between border rounded-xl shadow-lg bg-white overflow-hidden">
        {/* Left Image & Welcome Message */}
        <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-blue-50 items-center justify-center p-4">
          <div className="text-center">
            <h4 className="text-3xl font-bold mb-4">Welcome Back !!</h4>
            <img
              src={patient}
              alt="Patient"
              className="w-full max-w-xs lg:max-w-sm object-contain"
            />
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-3xl font-bold text-blue-500">SIGN IN</h2>
            {error && (
              <p className="text-red-700 font-semibold mt-2">{error}</p>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-lg font-bold mb-1">
                Email:
              </label>
              <input
                type="email"
                name="email"
                placeholder="johndoe@gmail.com"
                className="w-full p-2 border rounded-lg bg-slate-100 font-semibold text-lg outline-none focus:ring-1 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-lg font-bold mb-1"
              >
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your password"
                className="w-full p-2 border rounded-lg bg-slate-100 font-semibold text-lg outline-none focus:ring-1 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Logging..." : "Log In"}
            </button>
          </form>

          <p className="mt-4 text-center text-lg">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <div className="flex fixed bottom-10 right-4 p-3 rounded-full bg-blue-500 text-white text-2xl hover:bg-white hover:text-blue-500 border transition duration-200">
        <a href="/">
          <MdHome />
        </a>
      </div>
    </div>
  );
};

export default Login;
