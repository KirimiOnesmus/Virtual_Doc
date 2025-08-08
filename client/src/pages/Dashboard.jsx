import React, { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    const storedUserId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!storedRole || !storedUserId || !token) {
      console.log("No role or user ID found.");
      navigate("/login");
    } else {
      setUserRole(storedRole);
      setUserId(storedUserId);
      setLoading(false);

      console.log("Token before request:", token);
      axios.get(`http://localhost:8080/api/users/${storedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
          
        })
        .then((response) => {
          console.log("Token used in request:", token);
          const data = response.data.user || response.data;
          setUserData(data);
          setLoading(false);
          // 
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [navigate]);

  if (loading) return <p>Loading ...</p>;

  return (
    <div className="flex h-screen">
      <div className="  bg-gray-100  ">
        <SideMenu
          role={userRole}
          userId={userId}
          userData={userData}
          className=""
        />
      </div>
      <div className="w-full p-2">
        <Outlet context={{ userData }} />
      </div>
    </div>
  );
};

export default Dashboard;
