// import React, { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { IoPrintOutline } from "react-icons/io5";
// import axios from "axios";
// import { generatePayoutPDF } from "../utils/generatePayoutPDF";

// const PaymentDashboardDoctor = () => {
//   const doctorId = sessionStorage.getItem("userId");
//   const [recentPayouts, setRecentPayouts] = useState([]);
//   const [pendingPayouts, setPendingPayouts] = useState([]);
//   const [earningsData, setEarningsData] = useState([]);
//   const [totalEarnings, setTotalEarnings] = useState(0);
//   const token = sessionStorage.getItem("token");
//   const [reportRange, setReportRange] = useState("monthly");
//   const [doctorName, setDoctorName] = useState("");
  
//   useEffect(() => {
//     const name = sessionStorage.getItem("doctorName");
//   if (name) setDoctorName(name);
//     const fetchPayments = async () => {
//       console.log("User Id on fetch payment:", doctorId);
//       try {
//         const res = await axios.get(
//           `http://localhost:8080/api/payments/payouts/${doctorId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setRecentPayouts(res.data.recent);
//         setPendingPayouts(res.data.pending);
//         console.log("Full payout response:", res.data);
//       } catch (error) {
//         console.log("Error fetching payouts:", error);
//       }
//     };

//     const fetchSummary = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8080/api/payments/summary/${doctorId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setEarningsData(res.data.earnings);
//         setTotalEarnings(res.data.totalEarnings);
//         console.log("Full Earnings response:", res.data);
//       } catch (error) {
//         console.error("Error fetching summary:", error);
//       }
//     };
//     if (doctorId && token)  {
//       fetchPayments();
//       fetchSummary();
//     }
//   }, [doctorId]);

// const filterPayouts = (data) => {
//   const now = new Date();
//   return data.filter((payout) => {
//     const payoutDate = new Date(payout.date);
//     if (reportRange === "weekly") {
//       const oneWeekAgo = new Date();
//       oneWeekAgo.setDate(now.getDate() - 7);
//       return payoutDate >= oneWeekAgo;
//     }
//     if (reportRange === "monthly") {
//       return payoutDate.getMonth() === now.getMonth() && payoutDate.getFullYear() === now.getFullYear();
//     }
//     if (reportRange === "yearly") {
//       return payoutDate.getFullYear() === now.getFullYear();
//     }
//     return true;
//   });
// };

//   return (
//     <div className=" gap-4 flex justify-between min-h-screen w-full">
//       <div className="w-full overflow-y-auto space-y-2">
//         <div>
//           <div className="flex items-center justify-between p-2">
//             <h3 className="text-xl font-semibold">Recent payouts</h3>
//             <div className="flex gap-2">
//               <select
//                 value={reportRange}
//                 onChange={(e) => setReportRange(e.target.value)}
//                 className="p-2 border rounded-md text-sm"
//               >
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//                 <option value="yearly">Yearly</option>
//               </select>
//               <button
//                 // onClick={generatePDF}
//                 onClick={() => generatePayoutPDF(filterPayouts(recentPayouts), doctorName, reportRange)}
//                 className="px-4 py-2 bg-blue-500 text-white text-2xl rounded-md
//                               hover:text-blue-500 hover:bg-white transition-colors duration-300 hover:border border-blue-500"
//               >
//                 <IoPrintOutline />
//               </button>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 text-left">
//                 <tr>
//                   <th className="p-4">Date</th>
//                   <th className="p-4">Name</th>
//                   <th className="p-4">Status</th>
//                   <th className="p-4">Amount</th>
//                   <th className="p-4">Payment Code</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentPayouts.map((payout, idx) => (
//                   <tr key={idx} className="border-b">
//                     <td className="p-4">{payout.date}</td>
//                     <td className="p-4">{payout.patientName}</td>
//                     <td className="p-4">{payout.status}</td>
//                     <td className="p-4">Ksh {payout.amount}</td>
//                     <td className="p-4">{payout.paymentCode}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div>
//           <div className="flex items-center justify-between p-2">
//             <h3 className="text-xl font-semibold mb-2">Pending payouts</h3>
//             {/* <div className="flex gap-2">
//               <select
//                 // value={reportRange}
//                 // onChange={(e) => setReportRange(e.target.value)}
//                 className="p-2 border rounded-md text-sm"
//               >
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//                 <option value="yearly">Yearly</option>
//               </select>
//               <button
//                 // onClick={generatePDF}
//                 className="px-4 py-2 bg-blue-500 text-white text-2xl rounded-md
//                               hover:text-blue-500 hover:bg-white transition-colors duration-300 hover:border border-blue-500"
//               >
//                 <IoPrintOutline />
//               </button>
//             </div> */}
//           </div>

//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 text-left">
//                 <tr>
//                   <th className="p-4">Date</th>
//                   <th className="p-4">Name</th>
//                   <th className="p-4">Amount</th>
//                   <th className="p-4">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingPayouts.map((payout, idx) => (
//                   <tr key={idx} className="border-b">
//                     <td className="p-4">{payout.date}</td>
//                     <td className="p-4">{payout.patientName}</td>
//                     <td className="p-4">Ksh {payout.amount}</td>
//                     <td className="p-4">{payout.status}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       <div className="w-full flex flex-col gap-4">
//         <div className="bg-white p-6 rounded-xl shadow-md w-full ">
//           <div className="flex justify-between mb-4">
//             <div>
//               <p className="text-gray-500 text-sm">Total Earnings</p>
//               <h3 className="text-3xl font-semibold">Ksh {totalEarnings}</h3>
//               {/* <p className="text-green-600 text-sm">Last 30 days +10%</p> */}
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={earningsData}>
//               <XAxis dataKey="month" />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="earnings"
//                 stroke="#2563eb"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentDashboardDoctor;
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoPrintOutline } from "react-icons/io5";
import axios from "axios";
import { generatePayoutPDF } from "../utils/generatePayoutPDF";

const PaymentDashboardDoctor = () => {
  const doctorId = sessionStorage.getItem("userId");
  const [recentPayouts, setRecentPayouts] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const token = sessionStorage.getItem("token");
  const [reportRange, setReportRange] = useState("monthly");
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("doctorName");
    if (name) setDoctorName(name);

    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/payments/payouts/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecentPayouts(res.data.recent);
        setPendingPayouts(res.data.pending);
      } catch (error) {
        console.log("Error fetching payouts:", error);
      }
    };

    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/payments/summary/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEarningsData(res.data.earnings);
        setTotalEarnings(res.data.totalEarnings);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    if (doctorId && token) {
      fetchPayments();
      fetchSummary();
    }
  }, [doctorId]);

  const filterPayouts = (data) => {
    const now = new Date();
    return data.filter((payout) => {
      const payoutDate = new Date(payout.date);
      if (reportRange === "weekly") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return payoutDate >= oneWeekAgo;
      }
      if (reportRange === "monthly") {
        return (
          payoutDate.getMonth() === now.getMonth() &&
          payoutDate.getFullYear() === now.getFullYear()
        );
      }
      if (reportRange === "yearly") {
        return payoutDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full p-4">
      {/* Left Column: Tables */}
      <div className="w-full lg:w-2/3 space-y-6">
        {/* Recent payouts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">Recent payouts</h3>
            <div className="flex gap-2">
              <select
                value={reportRange}
                onChange={(e) => setReportRange(e.target.value)}
                className="p-2 border rounded-md text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button
                onClick={() =>
                  generatePayoutPDF(
                    filterPayouts(recentPayouts),
                    doctorName,
                    reportRange
                  )
                }
                className="px-4 py-2 bg-blue-500 text-white text-2xl rounded-md hover:bg-white hover:text-blue-500 border border-blue-500"
              >
                <IoPrintOutline />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Code</th>
                </tr>
              </thead>
              <tbody>
                {recentPayouts.map((payout, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-4">{payout.date}</td>
                    <td className="p-4">{payout.patientName}</td>
                    <td className="p-4">{payout.status}</td>
                    <td className="p-4">Ksh {payout.amount}</td>
                    <td className="p-4">{payout.paymentCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending payouts */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Pending payouts</h3>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayouts.map((payout, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-4">{payout.date}</td>
                    <td className="p-4">{payout.patientName}</td>
                    <td className="p-4">Ksh {payout.amount}</td>
                    <td className="p-4">{payout.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Earnings Chart */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
          <p className="text-gray-500 text-sm">Total Earnings</p>
          <h3 className="text-3xl font-semibold mb-4">Ksh {totalEarnings}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={earningsData}>
              <XAxis dataKey="month" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboardDoctor;

