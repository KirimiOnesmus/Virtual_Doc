import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import Doc from "../assests/homepage.png";
import {
  MdOutlineEmail,
  MdLocalPhone,
  MdLocationOn,
  MdHome,
} from "react-icons/md";
import { FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import teleconsultation from "../assests/teleconsultation.png";
import mentalHealth from "../assests/mentals-services.png";
import chronicDisease from "../assests/chronic-disease-management.png";
import diagnosis from "../assests/diagnosis.png";
import prescription from "../assests/prescription.png";

import logo from "../assests/logo.png";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const loginpage = () => {
    window.location.href = "/login";
  };
  const Register = () => {
    window.location.href = "/register";
  };
  return (
    <div className=" relative ">
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMenu}
          className="bg-blue-500 text-white text-3xl rounded-full p-3 shadow-lg hover:bg-blue-700"
        >
          <RiMenu2Fill />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden fixed top-20 right-4 w-64 bg-white shadow-lg rounded-lg border z-50 p-4">
          <ul className="flex flex-col gap-4 text-lg font-semibold text-gray-800">
            <li>
              <a href="#" onClick={toggleMenu} className="hover:text-blue-500">
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={toggleMenu}
                className="hover:text-blue-500"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#services"
                onClick={toggleMenu}
                className="hover:text-blue-500"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={toggleMenu}
                className="hover:text-blue-500"
              >
                Contact
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  Register();
                  toggleMenu();
                }}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Register
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  loginpage();
                  toggleMenu();
                }}
                className="w-full border border-blue-500 text-blue-500 py-2 rounded-md hover:bg-blue-500 hover:text-white"
              >
                Log In
              </button>
            </li>
          </ul>
        </div>
      )}

      <div className="flex shadow-md justify-between  py-4 px-8 text-xl  items-center backdrop-blur-2xl bg-white/20 ">
        <div>
          <img src={logo} alt="" width="100px" />
        </div>
        <div className="right md:flex gap-14 items-center hidden">
          <div className="links">
            <ul className="flex gap-6 ">
              <li>
                <a
                  href="#"
                  className="text-2xl font-semibold hover:text-blue-400 hover:text-xl"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-2xl font-semibold hover:text-blue-400 hover:text-xl"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-2xl font-semibold hover:text-blue-400 hover:text-xl"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-2xl font-semibold hover:text-blue-400 hover:text-xl"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div
            onClick={Register}
            className="btn flex gap-2 bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-800"
          >
            <i className="text-lg pt-2">
              <FaSignInAlt />
            </i>
            <input
              type="button"
              value="Register"
              className="text-xl font-semibold "
            />
          </div>
        </div>
      </div>
      <div className="body mx-12">
        <div className="home flex  md:mx-20 justify-around items-center my-16 md:my-0 h-fit md:mt-16">
          <div className="left w-full grid justify-items-center ">
            <div className="punchline pb-8">
              <h3 className="text-3xl md:text-5xl font-semibold pb-2">
                Your Health,{" "}
                <span className="font-bold text-blue-500">Our Commitment</span>
              </h3>
              <h4 className="font-semibold text-2xl md:text-4xl text-gray-700">
                Experience Quality Virtual Healthcare at Your Fingertips
              </h4>
              <p className="pt-4 text-xl md:text-2xl text-blue-400 italic">
                Access expert doctors anytime, anywhere securely and seamlessly.
              </p>
            </div>

            <div className="btn text-center flex gap-8 pb-4">
              <button
                className="  md:text-xl border px-4 md:px-6 py-2 rounded-md bg-blue-500 font-semibold text-white hover:text-black hover:bg-white"
                onClick={Register}
              >
                Get Started
              </button>
              <button
                className="  md:text-xl border px-6 md:px-12 py-2 rounded-md font-semibold hover:text-white hover:bg-blue-500"
                onClick={loginpage}
              >
                Log In
              </button>
            </div>
          </div>
          <div className="right md:w-full md:flex justify-center hidden ">
            <img src={Doc} alt="Doctors animination" className="h-96" />
          </div>
        </div>
        <div className="contact-info flex gap-4 md:justify-evenly border md:mx-16 -mx-8 py-6 -mt-4 rounded-md backdrop-blur-sm">
          <div className="email grid justify-items-center md:flex items-center  md:gap-4 text-sm px-1">
            <span className="p-2 bg-blue-400 font-semibold md:text-3xl text-white rounded-full w-fit text-center">
              {" "}
              <MdOutlineEmail />
            </span>
            <div className="details md:text-xl text-center">
              <h3 className="font-bold md:text-2xl">Email:</h3>
              <p className="font-semibold">
                <a href="#">onesmuskirimi64@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="phone grid justify-items-center text-sm md:flex items-center md:gap-4">
            <span className="p-2 bg-blue-400 font-semibold md:text-3xl text-white rounded-full">
              {" "}
              <MdLocalPhone />{" "}
            </span>

            <div className="details md:text-xl text-center">
              <h3 className="font-bold md:text-2xl">Phone:</h3>
              <p className="font-semibold">+254 768-444-502</p>
            </div>
          </div>
          <div className="location grid justify-items-center text-sm  md:flex items-center md:gap-4">
            <span className="p-2 bg-blue-400 font-semibold md:text-3xl text-white rounded-full">
              {" "}
              <MdLocationOn />
            </span>

            <div className="details md:text-xl text-center">
              <h3 className="font-bold md:text-2xl">Location:</h3>
              <p className="font-semibold">Nairobi,Kenya</p>
            </div>
          </div>
        </div>
        <div
          id="about"
          className="about md:mx-20 h-fit flex flex-col justify-center md:my-28 -mx-4 "
        >
          <h3 className="text-center my-10 text-3xl font-semibold">About Us</h3>
          <div className="intro text-center text-xl pb-8">
            Virtual Doc is a cutting-edge telemedicine platform designed to
            bring quality healthcare closer to you. Whether you need a quick
            consultation, chronic disease follow-up, or mental wellness support,
            we connect you to licensed medical professionals right from the
            comfort of your home. We believe healthcare should be accessible,
            affordable, and reliable and that’s our promise.
          </div>
          <div className="cards grid md:flex justify-evenly text-center gap-4 md:gap-6">
            <div className="mission  p-4 backdrop-blur-sm rounded bg-slate-100 shadow-md">
              <h4 className="font-bold text-xl md:text-2xl underline  py-2">
                Mission
              </h4>
              <p className="font-serif md:text-xl">
                To revolutionize healthcare access in Kenya and beyond by
                providing safe, timely, and personalized virtual care that puts
                patients first.
              </p>
            </div>
            <div className="vision  p-4 backdrop-blur-sm rounded bg-slate-100 shadow-lg">
              <h4 className="font-bold text-xl md:text-2xl underline  py-2">
                Vision
              </h4>
              <p className="font-serif  w-fit md:text-xl">
                To become the leading digital healthcare platform in Africa
                empowering communities through innovation, trust, and
                exceptional care.
              </p>
            </div>
            <div className="integrity  p-4 backdrop-blur-sm rounded bg-slate-100 shadow-md">
              <h4 className="font-bold text-xl md:text-2xl underline  py-2">
                Integrity
              </h4>
              <p className="font-serif md:text-xl">
                We uphold the highest ethical standards, ensuring transparency,
                patient privacy, and professional excellence in everything we
                do.
              </p>
            </div>
          </div>
        </div>
        <div id="services" className="service text-center  py-4 ">
          <h3 className="text-center my-10 text-3xl font-semibold">
            Clinic Services
          </h3>
          <div className="services md:mx-10 my-16 grid md:grid-cols-3 gap-6">
            <div className="teleconsultation bg-slate-50 shadow-md text-left flex flex-col border px-6 py-4 rounded-md backdrop-blur-lg">
              <div className="title flex items-center gap-2">
                <img
                  src={teleconsultation}
                  alt=""
                  width="70px"
                  className="rounded-full"
                />
                <p className=" md:text-2xl font-semibold">Teleconsultations</p>
              </div>
              <p className="text-sm md:text-xl">
                Instantly connect with licensed doctors for real-time video
                consultations or chat. No long queues — just quality care on
                demand.
              </p>
            </div>
            <div className="mentals-health bg-slate-50 shadow-md text-left flex flex-col border px-6 py-4 rounded-md backdrop-blur-lg">
              <div className="title flex  items-center gap-2">
                <img
                  src={mentalHealth}
                  alt=""
                  width="70px"
                  className="rounded-full"
                />
                <p className="text-xl md:text-2xl font-semibold">
                  Mental Health Services
                </p>
              </div>
              <p className="md:text-xl p-2 text-sm ">
                Talk to trusted therapists and psychiatrists through secure
                sessions. We’re here to support your emotional and psychological
                well-being
              </p>
            </div>
            <div className="disease-mangement bg-slate-50 shadow-md text-left flex flex-col border px-6 py-4 rounded-md backdrop-blur-lg">
              <div className="title flex  items-center gap-2">
                <img
                  src={chronicDisease}
                  alt=""
                  width="70px"
                  className="rounded-full"
                />
                <p className="text-xl md:text-2xl font-semibold">
                  Chronic Disease Management
                </p>
              </div>
              <p className="md:text-xl text-sm">
                Ongoing digital support for conditions like diabetes,
                hypertension, and asthma — with tailored plans, reminders, and
                expert follow-up.
              </p>
            </div>
            <div className="diagonistic-services bg-slate-50 shadow-md text-left flex flex-col border px-6 py-4 rounded-md backdrop-blur-lg">
              <div className="title flex items-center gap-2">
                <img
                  src={diagnosis}
                  alt=""
                  width="70px"
                  className="rounded-full"
                />
                <p className="text-xl md:text-2xl font-semibold">
                  Diagnostic Services
                </p>
              </div>
              <p className="text-sm md:text-xl">
                Get lab results, imaging reports, and medical opinions reviewed
                remotely. Clarity and peace of mind, wherever you are.
              </p>
            </div>
            <div className="Prescription-management bg-slate-50 shadow-md text-left flex flex-col border px-6 py-4 rounded-md backdrop-blur-lg">
              <div className="title flex items-center gap-2">
                <img
                  src={prescription}
                  alt=""
                  width="50px"
                  className="rounded-lg"
                />
                <p className="text-xl md:text-2xl font-semibold">
                  Prescription Management
                </p>
              </div>
              <p className="text-sm md:text-xl">
                Renew medications, receive online prescriptions, and manage your
                treatments with ease — all from your phone or computer.
              </p>
            </div>
          </div>
        </div>

        <div id="contact" className=" py-8 px-4 md:px-12 bg-white">
          <h3 className="text-center mb-10 text-3xl font-semibold ">
            Get in Touch With Us
          </h3>
          <div className="section flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className=" w-full md:w-1/2 flex flex-col justify-center items-center text-center px-4 md:px-8">
              <p className="text-2xl md:text-3xl font-semibold mb-4">
                Let’s Build a Healthier Tomorrow Together
              </p>
              <p className="text-gray-700 text-base md:text-lg">
                Got a question? Need a consultation? Our team is ready to guide
                you through your wellness journey.
              </p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-xl w-full md:w-1/2">
              <form action="" className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="font-semibold">
                    Name:
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="bg-gray-100 outline-none rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="font-semibold">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id=""
                    placeholder="johndoe@gmail.com"
                    className="bg-gray-100 outline-none rounded-lg p-2"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="font-semibold">
                    Message:
                  </label>
                  <textarea
                    name="message"
                    id=""
                    placeholder="Your message"
                    className="bg-gray-100 outline-none rounded-lg p-2"
                  ></textarea>
                </div>
                <div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold resize-none hover:text-blue-500 hover:bg-white hover:border border-blue-500">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="footer  text-center md:flex gap-2 pb-6 px-4 md:px-0 md:justify-around mt-10  py-4 w-full bg-slate-100">
        <div className="about w-full md:max-w-96">
          <h3 className="text-xl md:text-3xl font-bold text-blue-400 py-4">
            Who is Virtual Doc ?
          </h3>
          <p className="text-black text-sm md:text-xl font-serif">
            Virtual Doc is more than a platform it’s a healthcare movement.
            Built by medical professionals, for patients, our mission is to
            simplify how people access healthcare and make expert help available
            to all, regardless of location
          </p>
        </div>
        <div className="services">
          <h3 className=" text-xl md:text-3xl font-bold text-blue-400 py-4">
            What Do We Offer ?
          </h3>
          <ul className="text-black text-sm md:text-xl font-serif gap-y-4">
            <li>
              <a href="#services" className="hover:text-blue-400">
                Teleconsultations
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-400">
                Mental Health Services
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-400">
                Chronic Disease Management
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-400">
                Diagnostic Services
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-400">
                Prescription Management
              </a>
            </li>
          </ul>
        </div>
        <div className="socials mt-10 ">
          <ul className="flex justify-center gap-6 mb-10 text-xl md:text-3xl text-center ">
            <li className="LinkedIn bg-blue-400 p-2 rounded-full cursor-pointer text-white hover:text-blue-400 hover:bg-white border">
              <FaLinkedinIn />
            </li>
            <li className="Instagram bg-blue-400 p-2 rounded-full cursor-pointer text-white hover:text-blue-400 hover:bg-white border ">
              <FaInstagram />
            </li>
            <li className="Whatsapp bg-blue-400 p-2 rounded-full cursor-pointer text-white hover:text-blue-400 hover:bg-white border">
              <FaWhatsapp />
            </li>
          </ul>
          <div
            className="button border px-2 md:px-4 py-2 rounded-xl font-bold md:text-xl 
                cursor-pointer text-blue-400 hover:text-white hover:bg-blue-400"
            onClick={loginpage}
          >
            Book Appointment
          </div>
        </div>
      </div>
      <div className="hidden md:flex scroll-button fixed bottom-10  right-2 border p-4 rounded-full text-2xl text-white bg-blue-400 hover:bg-white hover:text-blue-400">
        <a href="#">
          <MdHome />
        </a>
      </div>
    </div>
  );
};

export default HomePage;
