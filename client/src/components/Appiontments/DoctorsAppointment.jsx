// import React, { useEffect, useState } from "react";
// import { IoCloseOutline } from "react-icons/io5";
// import axios from "axios";

// const DoctorsAppointment = ({ onClose }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchAppointments = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/api/appointments", {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//         },
//       });

//       const filtered = res.data.filter(
//         (appt) => appt.status === "pending" || appt.status === "cancelled"
//       );

//       setAppointments(filtered);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   const updateStatus = async (appointmentId, status) => {
//     if (status !== "confirmed" && status !== "rejected") return;

//     const endpoint =
//       status === "comfirmed"
//         ? `http://localhost:8080/api/appointments/${appointmentId}/accept`
//         : `http://localhost:8080/api/appointments/${appointmentId}/reject`;

//     try {
//       await axios.patch(
//         endpoint,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchAppointments();
//     } catch (error) {
//       console.error(`Error ${status} appointment:`, error);
//       alert(`Could not ${status} appointment.`);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const today = new Date().toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });

//   if (loading)
//     return (
//       <p className="p-6 text-center text-red-500 font-semibold">
//         Loading appointments...
//       </p>
//     );

//   return (
//     <div>
//       <div
//         onClick={onClose}
//         className="fixed inset-0 bg-black bg-opacity-40 z-40"
//       />
//       <div className="fixed top-0 right-0 w-3/4 h-full bg-gray-100 z-50 shadow-lg transform transition-transform duration-300 animate-slideInLeft overflow-y-auto p-6">
//         <div>
//           <div className="flex justify-between items-center mb-4 border-b-2 pb-2">
//             <h2 className="text-2xl font-bold">Requested Appointments</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-600 text-2xl hover:text-red-500"
//             >
//               <IoCloseOutline />
//             </button>
//           </div>

//           {/* Navigation & Search */}
//           <div className="buttons flex justify-between mb-4">
//             <div className="flex items-center gap-4">
//               <span className="bg-white px-4 py-1 rounded-lg">{today}</span>
//             </div>
//             <input
//               type="search"
//               placeholder="Search Patient..."
//               className="outline-none border-gray-300 border rounded-lg px-2 py-1"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Appointment Cards */}
//           <div className="bg-white space-y-4 rounded-md">
//             {appointments
//               .filter((appt) =>
//                 appt.patient?.name
//                   ?.toLowerCase()
//                   .includes(searchQuery.toLowerCase())
//               )
//               .map((appt) => (
//                 <div
//                   key={appt.id}
//                   className="flex flex-wrap md:flex-nowrap justify-around items-center p-4 border rounded shadow gap-2"
//                 >
//                   <img
//                     src={appt.avatar}
//                     alt="patient avatar"
//                     className="rounded-full h-14 w-14 object-cover"
//                   />
//                   <p>{appt.patient?.name}</p>
//                   <p>{appt.date}</p>
//                   <p>{appt.time}</p>
//                   <p
//                     className={`font-medium px-2 py-1 rounded-full text-sm w-fit ${
//                       appt.status === "pending"
//                         ? "text-yellow-800 bg-yellow-100"
//                         : appt.status === "cancelled"
//                         ? "text-red-800 bg-red-100"
//                         : appt.status === "accepted"
//                         ? "text-green-800 bg-green-100"
//                         : "text-gray-600 bg-gray-100"
//                     }`}
//                   >
//                     {appt.status}
//                   </p>

//                   {appt.status === "pending" ? (
//                     <div className="space-x-2 mt-2">
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-white hover:text-blue-500 border border-transparent hover:border-blue-500 transition-all"
//                         onClick={() => updateStatus(appt.id, "accepted")}
//                       >
//                         Accept
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-white hover:text-red-500 border border-transparent hover:border-red-500 transition-all"
//                         onClick={() => updateStatus(appt.id, "rejected")}
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   ) : (
//                     <p className="text-sm italic text-red-600">
//                       Auto-cancelled
//                     </p>
//                   )}
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorsAppointment;
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";

const DoctorsAppointment = ({ onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/appointments", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const filtered = res.data.filter(
        (appt) => appt.status === "pending" || appt.status === "cancelled"
      );

      setAppointments(filtered);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    const endpoint =
      status === "accepted"
        ? `http://localhost:8080/api/appointments/${appointmentId}/accept`
        : `http://localhost:8080/api/appointments/${appointmentId}/reject`;

    try {
      await axios.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetchAppointments();
    } catch (error) {
      console.error(`Error ${status} appointment:`, error);
      alert(`Could not ${status} appointment.`);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Pagination logic
  const filteredAppointments = appointments.filter((appt) =>
    appt.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const goToPage = (number) => setCurrentPage(number);

  if (loading)
    return (
      <p className="p-6 text-center text-red-500 font-semibold">
        Loading appointments...
      </p>
    );

  return (
    <div>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-40 z-40" />

      {/* Main Drawer */}
      <div className="fixed top-0 right-0 w-full sm:w-4/5 md:w-3/4 lg:w-2/5 h-full bg-gray-100 z-50 shadow-lg transition-all duration-300 overflow-y-auto p-4 sm:p-6 animate-slideInLeft">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Requested Appointments</h2>
          <button onClick={onClose} className="text-gray-600 text-2xl hover:text-red-500">
            <IoCloseOutline />
          </button>
        </div>

        {/* Search and Date */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <span className="bg-white px-4 py-1 rounded-lg w-fit">{today}</span>
          <input
            type="search"
            placeholder="Search Patient..."
            className="outline-none border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4">
          {currentAppointments.map((appt) => (
            <div
              key={appt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border bg-white rounded-md shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={appt.avatar || "/default-avatar.png"}
                  alt="patient avatar"
                  className="rounded-full h-12 w-12 object-cover"
                />
                <div>
                  <p className="font-medium">{appt.patient?.name}</p>
                  <p className="text-sm text-gray-500">{appt.date} at {appt.time}</p>
                </div>
              </div>

              <p
                className={`font-medium px-2 py-1 rounded-full text-sm w-fit ${
                  appt.status === "pending"
                    ? "text-yellow-800 bg-yellow-100"
                    : appt.status === "cancelled"
                    ? "text-red-800 bg-red-100"
                    : appt.status === "accepted"
                    ? "text-green-800 bg-green-100"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                {appt.status}
              </p>

              {appt.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-white hover:text-blue-500 border hover:border-blue-500 transition"
                    onClick={() => updateStatus(appt.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-white hover:text-red-500 border hover:border-red-500 transition"
                    onClick={() => updateStatus(appt.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <p className="text-sm italic text-red-600">Auto-cancelled</p>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsAppointment;

