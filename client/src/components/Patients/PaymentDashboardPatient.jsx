import React, { useState, useEffect } from "react";
import { CiCreditCard1 } from "react-icons/ci";
import { TbDeviceMobileDollar } from "react-icons/tb";
import avatar from "../../assests/doctor2.png";
import api from "../../config/api";

const PaymentDashboardPatient = () => {
  const [activeMethod, setActiveMethod] = useState("mobile");
  const token = sessionStorage.getItem("token");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [pending, setPending] = useState([]);
  const [payments, setPayments] = useState([]);
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    const pendingPayments = async () => {
      try {
        const res = await api.get(`/payments/patient/${userId}/pendingbills`);
        setPending(res.data);
      } catch (error) {
        console.log("Error fetching pending payments");
      }
    };

    const fetchPatientPayments = async () => {
      try {
        const res = await api.get(`/payments/patient/${userId}`);
        setPayments(res.data);
      } catch (error) {
        console.log("Error fetching past payments", error);
      }
    };

    pendingPayments();
    fetchPatientPayments();
  }, []);

  const handleMobilePayment = async (e) => {
    e.preventDefault();
    if (!phone || !provider) {
      alert("Please enter phone number and select a provider.");
      return;
    }
    try {
      const response = await api.post(
        "", // replace with your endpoint
        {
          phone,
          provider,
          appointmentId: selectedAppointment?.appointmentId,
          amount: selectedAppointment?.amount,
        }
      );
      alert("Payment initiated. Please check your phone.");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment");
    }
  };

  return (
    <div className="w-full px-4 md:px-6 py-4 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side: Tables */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Pending Payouts */}
          <div className="bg-white rounded-xl shadow-md flex-1 min-h-[300px] max-h-[50vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg md:text-xl font-semibold">
                Pending Payouts
              </h3>
              <select className="p-2 border rounded-md text-sm">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left sticky top-0 z-10">
                  <tr>
                    <th className="p-4 bg-gray-50">Date</th>
                    <th className="p-4 bg-gray-50">Name</th>
                    <th className="p-4 bg-gray-50">Amount</th>
                    <th className="p-4 bg-gray-50 hidden md:table-cell">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pending.length > 0 ? (
                    pending.map((item) => (
                      <tr
                        key={item.appointmentId}
                        onClick={() => setSelectedAppointment(item)}
                        className="border-b cursor-pointer hover:bg-gray-100"
                      >
                        <td className="p-4">{item.date}</td>
                        <td className="p-4">{item.doctorName}</td>
                        <td className="p-4">Kes {item.amount || "0.00"}</td>
                        <td className="p-4 hidden md:table-cell capitalize text-yellow-600">
                          {item.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4" colSpan="4">
                        No pending payouts
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-white rounded-xl shadow-md flex-1 min-h-[300px] max-h-[50vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg md:text-xl font-semibold">
                Recent Payouts
              </h3>
              <select className="p-2 border rounded-md text-sm">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left sticky top-0 z-10">
                  <tr>
                    <th className="p-4 bg-gray-50">Date</th>
                    <th className="p-4 bg-gray-50">Name</th>
                    <th className="p-4 bg-gray-50 hidden md:table-cell">
                      Status
                    </th>
                    <th className="p-4 bg-gray-50">Amount</th>
                    <th className="p-4 bg-gray-50 hidden md:table-cell">
                      Payment Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="p-4">{payment.date}</td>
                        <td className="p-4">{payment.doctorName}</td>
                        <td className="p-4 hidden md:table-cell capitalize text-green-600">
                          {payment.status}
                        </td>
                        <td className="p-4">Kes {payment.amount}</td>
                        <td className="p-4 hidden md:table-cell">
                          {payment.transaction_id || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4" colSpan="5">
                        No recent payouts
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side: Summary and Payment Form */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-md p-4 space-y-6">
          {selectedAppointment && (
            <div>
              <h2 className="font-semibold text-xl mb-4">Payment Summary</h2>
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedAppointment.doctorAvatar
                      ? `http://localhost:8080/${selectedAppointment.doctorAvatar.replace(
                          /^\/+/,
                          ""
                        )}`
                      : avatar
                  }
                  alt="doctor avatar"
                  className="h-16 w-16 rounded-full"
                />
                <div className="text-sm text-gray-600">
                  <p className="text-md font-semibold text-black">
                    {selectedAppointment.doctorName}
                  </p>
                  <p>{selectedAppointment.department}</p>
                  <p>{selectedAppointment.date}</p>
                </div>
              </div>
              <div className="mt-4 text-gray-600 space-y-2">
                {(() => {
                  const amount = parseFloat(selectedAppointment.amount || 0);
                  const tax = amount * 0.2;
                  const total = amount + tax;
                  return (
                    <>
                      <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p className="font-semibold text-black">
                          Kes {amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Tax (20%)</p>
                        <p className="font-semibold text-black">
                          Kes {tax.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between font-semibold text-black pt-2 border-t mt-2">
                        <p>Total</p>
                        <p>Kes {total.toFixed(2)}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-semibold text-xl mb-4">Payment Methods</h2>
            <div className="flex flex-col md:flex-row justify-around gap-4 mb-4">
              <button
                onClick={() => setActiveMethod("card")}
                disabled
                className={`flex flex-col items-center gap-2 py-2 px-4 rounded-md text-sm font-medium border transition-all ${
                  activeMethod === "card"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-600 hover:text-blue-500 hover:border-blue-500"
                }`}
              >
                <CiCreditCard1 className="text-xl" />
                <span>Card</span>
              </button>
              <button
                onClick={() => setActiveMethod("mobile")}
                className={`flex flex-col items-center gap-2 py-2 px-4 rounded-md text-sm font-medium border transition-all ${
                  activeMethod === "mobile"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-600 hover:text-blue-500 hover:border-blue-500"
                }`}
              >
                <TbDeviceMobileDollar className="text-xl" />
                <span>Mobile</span>
              </button>
            </div>

            {activeMethod === "mobile" && (
              <form className="space-y-4" onSubmit={handleMobilePayment}>
                <div>
                  <label htmlFor="phone" className="block mb-1 text-sm">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 07XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded-md outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="provider" className="block mb-1 text-sm">
                    Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full p-2 border rounded-md outline-none focus:border-blue-500"
                  >
                    <option value="">Select Provider</option>
                    <option value="mpesa">M-PESA</option>
                    <option value="airtel">Airtel Money</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!selectedAppointment}
                  className={`w-full mt-2 p-2 rounded-lg font-semibold transition-all ${
                    !selectedAppointment
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:text-blue-500 hover:bg-white hover:border border-blue-500"
                  }`}
                >
                  Pay Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboardPatient;
