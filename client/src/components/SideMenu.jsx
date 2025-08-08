import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assests/logo.png";
import { IoPersonOutline } from "react-icons/io5";
import { RiDashboard3Line } from "react-icons/ri";
import { LuCalendarClock } from "react-icons/lu";
import { TbReportMoney } from "react-icons/tb";
import { BiMessageRoundedDots } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";

const SideMenu = ({ role, userId, userData }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const allLinks = [
    {
      id: 1,
      path: "/dashboard/overview",
      name: "Overview",
      icon: <RiDashboard3Line />,
    },
    {
      id: 2,
      path: "/dashboard/schedule",
      name: "Schedule",
      icon: <LuCalendarClock />,
      children: [
        {
          id: 51,
          path: "/dashboard/schedule/manage-week",
          name: "Manage Week",
        },
        {
          id: 52,
          path: "/dashboard/schedule/calendar",
          name: "Calendar",
        },
      ],
    },
    {
      id: 3,
      path: "/dashboard/patients",
      name: "Patients",
      icon: <IoPersonOutline />,
    },
    {
      id: 4,
      path: "/dashboard/messages",
      name: "Messages",
      icon: <BiMessageRoundedDots />,
    },
    {
      id: 6,
      path: "/dashboard/doctors",
      name: "Doctors",
      icon: <FaUserDoctor />,
    },
    {
      id: 5,
      path: "/dashboard/appointments",
      name: "Appointments",
      icon: <LuCalendarClock />,
    },
    {
      id: 7,
      path: "/dashboard/payment",
      name: "Payment Info",
      icon: <TbReportMoney />,
    },
    {
      id: 8,
      path: "/dashboard/DoctorRegistration",
      name: "Doctor Registration",
      icon: <FaUserDoctor />,
    },
  ];

  const sidebarLinks = allLinks.filter((link) => {
    if (role === "doctor") {
      return [
        "Overview",
        "Calendar",
        "Patients",
        "Messages",
        "Payment Info",
        "Schedule",
      ].includes(link.name);
    } else if (role === "patient") {
      return [
        "Overview",
        "Appointments",
        "Doctors",
        "Messages",
        "Payment Info",
      ].includes(link.name);
    } else if (role === "admin" || role === "super-admin") {
      return [
        "Overview",
        "Patients",
        "Doctors",
        "Appointments",
        "Doctor Registration",
      ].includes(link.name);
    }
    return false;
  });

  const getUserRoleLabel = () => {
    if (role === "doctor") return userData?.specialization || "Doctor";
    if (role === "patient") return "Patient";
    if (role === "admin") return "Admin";
    if (role === "super-admin") return "Super Admin";
    return "User";
  };

  // useEffect(() => {
  //   const current = allLinks.find((link) => link.path === location.pathname);
  //   setActiveLink(current ? current.id : null);
  // }, [location.pathname]);
  useEffect(() => {
    const current = allLinks.find(
      (link) =>
        link.path === location.pathname ||
        link.children?.some((child) => child.path === location.pathname)
    );
    setActiveLink(current ? current.id : null);
  }, [location.pathname]);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".submenu-button")) {
      setOpenSubmenu(null);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

  return (
    <>
      <div className="hidden md:flex h-full w-fit lg:w-full shadow-md">
        <aside className="flex flex-col justify-between items-center h-full bg-white w-16 lg:w-56">
          <div className="w-full">
            <div className="w-full flex justify-center lg:justify-start px-2 pt-4 mb-4">
              <img
                src={Logo}
                alt="Logo"
                className="w-10 h-10 lg:w-24 lg:h-12"
              />
            </div>

            <ul className="px-1 lg:px-2">
              {sidebarLinks.map((link) => (
                <li key={link.id} className="pt-1">
                  <Link
                    to={link.path}
                    onClick={() => setActiveLink(link.id)}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all duration-200 ${
                      activeLink === link.id
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium hidden lg:block">
                      {link.name}
                    </span>
                  </Link>

                  {role === "doctor" && link.children && (
                    <ul className="ml-6 mt-1">
                      {link.children.map((child) => (
                        <li key={child.id} className="pt-1">
                          <Link
                            to={child.path}
                            className={`block px-3 py-1 rounded text-sm ${
                              location.pathname === child.path
                                ? "bg-blue-100 text-blue-800 font-medium"
                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {userData ? (
            <div
              onClick={() => navigate(`/dashboard/profile/${userData?.id}`)}
              className="w-full border-t px-4 py-4 hover:cursor-pointer hover:bg-gray-100 flex justify-center lg:justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white overflow-hidden">
                  {userData.avatar ? (
                    <img
                      src={
                        userData.avatar.startsWith("http")
                          ? userData.avatar
                          : `http://localhost:8080${userData.avatar}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {userData.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="hidden lg:block">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {userData.name}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">
                    {getUserRoleLabel()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full border-t px-4 py-4 text-sm text-gray-400 text-center">
              Loading user...
            </div>
          )}
        </aside>
      </div>
      {/* Small Screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50">
        <div className="relative flex justify-around items-center h-14">
          {sidebarLinks.map((link) => {
            const hasChildren = link.children && role === "doctor";

            return (
              <div key={link.id} className="relative">
                <button
                  onClick={() => {
                    if (hasChildren) {
                      setOpenSubmenu(openSubmenu === link.id ? null : link.id);
                    } else {
                      setActiveLink(link.id);
                      navigate(link.path);
                    }
                  }}
                  className={`submenu-button flex flex-col items-center justify-center text-xs px-2 ${
                    activeLink === link.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  <div className="text-2xl">{link.icon}</div>
                </button>

                {/* Submenu popup */}
                {hasChildren && openSubmenu === link.id && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white border rounded shadow-md z-50 min-w-[120px] py-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.path}
                        onClick={() => {
                          setOpenSubmenu(null);
                          setActiveLink(child.id);
                        }}
                        className={`block px-3 py-2 text-sm text-center hover:bg-blue-100 ${
                          location.pathname === child.path
                            ? "text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Profile Icon */}
          <div
            onClick={() => navigate(`/dashboard/profile/${userData?.id}`)}
            className="flex flex-col items-center justify-center text-xs text-gray-500 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-500 text-white flex items-center justify-center">
              {userData?.avatar ? (
                <img
                  src={
                    userData.avatar.startsWith("http")
                      ? userData.avatar
                      : `http://localhost:8080${userData.avatar}`
                  }
                  alt="Me"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
