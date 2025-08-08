// import React, { useEffect, useState } from "react";
// import { IoEyeOutline } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const AppointmentList = () => {
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [patients, setPatients] = useState([]);
//   const navigate = useNavigate();

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const doctorId = sessionStorage.getItem("userId");
//         const res = await axios.get(
//           `http://localhost:8080/api/doctors/${doctorId}/patients`,
//           {
//             headers: {
//               Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//             },
//           }
//         );
//         setPatients(res.data);
//         console.log("Patient data:", res.data);
//       } catch (error) {
//         console.error("Failed to fetch patients:", error);
//       }
//     };
//     fetchPatients();
//   }, []);

//   const handleView = (patientId) => {
//     navigate(`/dashboard/patient-details/${patientId}`);
//   };

//   // const toggleDropdown = (id) => {
//   //   setSelectedPatient((prev) => (prev === id ? null : id));
//   // };

//   return (
//     <div className="p-6 max-h-fit">
//       <h2 className="text-4xl font-bold font-mono mb-2">Patient List</h2>
//       <div className="table bg-white shadow-md rounded-lg overflow-hidden w-full">
//         <table className="w-full bg-white">
//           <thead className="text-left text-gray-500 font-light sticky top-0 bg-white z-10">
//             <tr className="text-left text-gray-500 font-light sticky top-0 bg-white z-10 text-base">
//               <th className="py-3 px-4"></th>
//               <th className="py-3 px-4">Basic Info</th>
//               <th className="py-3 px-4">City/Town</th>
//               <th className="py-3 px-4">Last Appointment</th>
//               <th className="py-3 px-4">Joining Date</th>
//               <th className="py-3 px-4">Action</th>
//             </tr>
//           </thead>
//           <tbody className="text-sm">
//             {patients.map((patient, index) => (
//               <tr
//                 key={patient.userId}
//                 className="border-b hover:bg-gray-50 hover:cursor-pointer"
//               >
//                 <td className="py-3 px-4 flex items-center gap-3">
//                   {patient.avatar ? (
//                     <img
//                       src={`http://localhost:8080${patient.avatar}`}
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "/default-avatar.png";
//                       }}
//                       alt={patient.name}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
//                       {patient.name?.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                 </td>
//                 <td className="py-3 px-4">
//                   <div className="basic-info">
//                     <p className="font-medium text-sm">{patient.name}</p>
//                     <p className="text-sm text-gray-500">{patient.email}</p>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4">{patient.city || "N/A"}</td>
//                 <td className="py-3 px-4">
//                   {formatDate(patient.lastAppointment)}
//                 </td>
//                 <td className="py-3 px-4">
//                   {formatDate(patient.registerDate)}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <IoEyeOutline
//                     title="View Patient"
//                     className="text-xl cursor-pointer"
//                     onClick={() => handleView(patient.userId)}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AppointmentList;
import React, { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentList = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust for your UI
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const doctorId = sessionStorage.getItem("userId");
        const res = await axios.get(
          `http://localhost:8080/api/doctors/${doctorId}/patients`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setPatients(res.data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const handleView = (patientId) => {
    navigate(`/dashboard/patient-details/${patientId}`);
  };

  // Pagination Logic
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPatients = patients.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl md:text-4xl font-bold font-mono mb-4">
        Patient List
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-[700px] w-full">
          <thead className="text-left text-gray-500 font-light sticky top-0 bg-white z-10 text-sm md:text-base">
            <tr>
              <th className="py-3 px-4"></th>
              <th className="py-3 px-4">Basic Info</th>
              <th className="py-3 px-4">City/Town</th>
              <th className="py-3 px-4">Last Appointment</th>
              <th className="py-3 px-4">Joining Date</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {paginatedPatients.map((patient) => (
              <tr
                key={patient.userId}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">
                  {patient.avatar ? (
                    <img
                      src={`http://localhost:8080${patient.avatar}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                      alt={patient.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                      {patient.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>

                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-gray-500 text-sm">{patient.email}</p>
                  </div>
                </td>

                <td className="py-3 px-4">{patient.city || "N/A"}</td>

                <td className="py-3 px-4">
                  {formatDate(patient.lastAppointment)}
                </td>

                <td className="py-3 px-4">
                  {formatDate(patient.registerDate)}
                </td>

                <td className="py-3 px-4 text-center">
                  <IoEyeOutline
                    title="View Patient"
                    className="text-lg md:text-xl cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => handleView(patient.userId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 px-1">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AppointmentList;
