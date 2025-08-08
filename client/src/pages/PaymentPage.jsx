import React,{useEffect,useState} from "react";
import { PaymentDashboardDoctor,PaymentDashboardPatient } from "../components";
// import { use } from "react";


const PaymentPage = () => {
  const [userRole, setUserRole] = useState(null);
  // const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    const storedUserId = sessionStorage.getItem('userId');
    setUserRole(storedRole);
    // setUserId(storedUserId);
  },[]);

  return (
    <div className="bg-gray-100  p-2 max-h-screen overflow-y-auto scrollbar-hide">
       <h2 className="text-3xl font-bold font-mono">Payment Information</h2>
      {userRole === "doctor" && <PaymentDashboardDoctor />}
      {userRole === "patient" && <PaymentDashboardPatient />}
      {!userRole && (
        <p className="text-gray-600 mt-4">
          Loading user role or user role not set...
        </p>
      )}

    </div>
  );
};

export default PaymentPage;
