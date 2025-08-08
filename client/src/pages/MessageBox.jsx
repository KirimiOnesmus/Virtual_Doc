// import React, { useState, useEffect } from "react";
// import { FiSend } from "react-icons/fi";
// import { IoMdAttach } from "react-icons/io";
// import profile from "../assests/doctor1.jpg";
// import io from "socket.io-client";
// import axios from "axios";

// // Socket.IO setup with auth token
// const token = sessionStorage.getItem("token");
// const socket = io("http://localhost:8080", {
//   auth: { token },
// });

// const MessageBox = () => {
//   const currentUser = JSON.parse(sessionStorage.getItem("user"));
//   const isDoctor = currentUser.role === "doctor";
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [chatPartner, setChatPartner] = useState(null);
//   const [appointments, setAppointments] = useState([]);

//   // Fetch old messages (optional)
//   useEffect(() => {
//     if (selectedAppointment) {
//       axios
//         .get(`http://localhost:8080/api/messages/${selectedAppointment.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           const enriched = res.data.map((msg) => {
//             const sender =
//               msg.sender_id === selectedAppointment.doctor.id
//                 ? selectedAppointment.doctor
//                 : selectedAppointment.patient;
//             return { ...msg, sender };
//           });
//           setMessages(enriched);
//         })
//         .catch((err) => console.error("Failed to fetch messages:", err));
//       const partner = isDoctor
//         ? selectedAppointment.patient
//         : selectedAppointment.doctor;
//       setChatPartner(partner);
//     }
//     console.log("Selected appointment:", selectedAppointment);
//   }, [selectedAppointment]);

//   // Socket.IO receive
//   useEffect(() => {
//     socket.on("receiveMessage", (msg) => {
//       if (
//         selectedAppointment &&
//         msg.appointment_id === selectedAppointment.id
//       ) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });
//     return () => socket.off("receiveMessage");
//   }, [selectedAppointment]);
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/api/appointments", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAppointments(
//           res.data.filter(
//             (a) => a.consultation_mode === "chat" && a.status === "pending"
//           )
//         );
//         console.log("Fetched appointments:", res.data);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };
//     fetchAppointments();
//   }, []);

//   // const sendMessage = async () => {
//   //   if (!input.trim() && !file) return;

//   //   if (!selectedAppointment || !chatPartner) return;

//   //   const formData = new FormData();
//   //   formData.append("text", input);
//   //   formData.append("sender_id", currentUser.id);
//   //   formData.append("receiver_id", chatPartner.id);
//   //   formData.append("appointment_id", selectedAppointment.id);
//   //   if (file) formData.append("attachment", file);

//   //   try {
//   //     const res = await axios.post(
//   //       "http://localhost:8080/api/messages",
//   //       formData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );

//   //     setMessages((prev) => [...prev, res.data]);
//   //     socket.emit("sendMessage", res.data);
//   //     setInput("");
//   //     setFile(null);
//   //   } catch (err) {
//   //     console.error("Failed to send message:", err);
//   //   }
//   // };
//   const sendMessage = async () => {
//     if (!input.trim() && !file) return;
//     if (!selectedAppointment || !chatPartner) return;

//     const formData = new FormData();
//     formData.append("text", input);
//     formData.append("sender_id", currentUser.id);
//     formData.append("receiver_id", chatPartner.id);
//     formData.append("appointment_id", selectedAppointment.id);
//     if (file) formData.append("attachment", file);

//     try {
//       const res = await axios.post(
//         "http://localhost:8080/api/messages",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const newMessage = res.data;

//       setMessages((prev) => [...prev, newMessage]);

//       socket.emit("sendMessage", {
//         appointment_id: selectedAppointment.id,
//         receiver_id: chatPartner.id,
//         text: newMessage.text || null,
//         attachment_url: newMessage.attachment_url || null,
//       });

//       setInput("");
//       setFile(null);
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };
//   return (
//     <div className="flex flex-col md:flex-row h-screen gap-4 p-2">
//       <main className="flex-1 flex flex-col bg-white m-2 rounded-lg shadow-xl">
//         <div className="flex items-center justify-between border-b px-4 py-2 mb-2">
//           {chatPartner ? (
//             <div className="flex items-center space-x-2">
//               <img
//                 src={chatPartner.avatar}
//                 alt="Partner"
//                 className="w-8 h-8 rounded-full"
//               />
//               <div>
//                 <h2 className="text-lg font-semibold">{chatPartner.name}</h2>
//                 <span className="text-green-500 text-xs">
//                   {chatPartner.online ? "Online" : "Offline"}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="text-gray-500">
//               Select a chat appointment to begin
//             </div>
//           )}
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-auto space-y-4 p-2">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex items-end ${
//                 msg.sender_id === currentUser.id
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               {msg.sender_id !== currentUser.id && (
//                 // <img
//                 //   src={chatPartner?.avatar || profile}
//                 //   alt={chatPartner?.name || "Sender"}
//                 //   className="w-8 h-8 rounded-full mr-2"
//                 // />
//                 <img
//                   src={msg.sender?.avatar || profile}
//                   alt={msg.sender?.name || "Sender"}
//                   className="w-8 h-8 rounded-full mr-2"
//                 />
//               )}
//               <div
//                 className={`p-2 text-sm rounded-lg max-w-xs ${
//                   msg.sender_id === currentUser.id
//                     ? "bg-blue-500 text-white rounded-tl-2xl"
//                     : "bg-gray-100 text-gray-800 rounded-tr-2xl"
//                 }`}
//               >
//                 <div>{msg.text}</div>
//                 {msg.attachment_url && (
//                   <a
//                     href={msg.attachment_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline text-blue-100 text-xs"
//                   >
//                     View Attachment
//                   </a>
//                 )}
//               </div>
      
//               <img
//                 src={msg.sender?.avatar || profile}
//                 alt={msg.sender?.name || "Sender"}
//                 className="w-8 h-8 rounded-full"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Input */}
//         <div className="flex my-4 px-4 items-center justify-center">
//           <label className="cursor-pointer mr-2 mt-1">
//             <IoMdAttach className="w-6 h-6 text-gray-500" title="Attach file" />
//             <input
//               type="file"
//               className="hidden"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//           </label>
//           <input
//             type="text"
//             className="flex-1 p-2 bg-gray-100 outline-none rounded-lg focus:border border-blue-500 "
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder={
//               chatPartner
//                 ? "Type a message..."
//                 : "Select a patient to start chatting"
//             }
//             disabled={!chatPartner}
//           />
//           <button
//             onClick={sendMessage}
//             title="Send"
//             className="ml-2 bg-blue-500 text-white p-3 rounded-full hover:text-blue-500 hover:bg-gray-100 hover:border hover:border-blue-500"
//             disabled={!chatPartner}
//           >
//             <FiSend />
//           </button>
//         </div>
//       </main>

//       {/* Sidebar */}
//       <aside className="w-full md:w-1/3 xl:w-1/4 mt-4 md:mt-0 bg-white p-4 shadow-lg rounded-md overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-3">Chat Appointments</h2>
//         {appointments.map((appointment) => {
//           const partner =
//             currentUser.role === "doctor"
//               ? appointment.patient || "Unknown Patient"
//               : appointment.doctor || "Unknown Doctor";
//           console.log("Partner object:", partner);

//           return (
//             <div
//               key={appointment.id}
//               onClick={() => setSelectedAppointment(appointment)}
//               className="flex items-center justify-between p-2 mb-2 hover:bg-gray-100 rounded-md cursor-pointer"
//             >
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={partner.avatar || profile}
//                   alt={partner.name}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div>
//                   <h3 className="text-sm font-medium">{partner.name}</h3>
//                   {partner.online ? (
//                     <span className="text-green-500 text-sm ml-2">Online</span>
//                   ) : (
//                     <span className="text-gray-400 text-sm ml-2">Offline</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </aside>
//     </div>
//   );
// };

// export default MessageBox;
import React, { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { IoMdAttach } from "react-icons/io";
import profile from "../assests/doctor1.jpg";
import io from "socket.io-client";
import axios from "axios";

const token = sessionStorage.getItem("token");
const socket = io("http://localhost:8080", {
  auth: { token },
});

const MessageBox = () => {
  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const isDoctor = currentUser.role === "doctor";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (selectedAppointment) {
      axios
        .get(`http://localhost:8080/api/messages/${selectedAppointment.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const enriched = res.data.map((msg) => {
            const sender =
              msg.sender_id === selectedAppointment.doctor.id
                ? selectedAppointment.doctor
                : selectedAppointment.patient;
            return { ...msg, sender };
          });
          setMessages(enriched);
        })
        .catch((err) => console.error("Failed to fetch messages:", err));

      const partner = isDoctor
        ? selectedAppointment.patient
        : selectedAppointment.doctor;
      setChatPartner(partner);
    }
  }, [selectedAppointment]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        selectedAppointment &&
        msg.appointment_id === selectedAppointment.id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [selectedAppointment]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(
          res.data.filter(
            (a) => a.consultation_mode === "chat" && a.status === "pending"
          )
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;
    if (!selectedAppointment || !chatPartner) return;

    const formData = new FormData();
    formData.append("text", input);
    formData.append("sender_id", currentUser.id);
    formData.append("receiver_id", chatPartner.id);
    formData.append("appointment_id", selectedAppointment.id);
    if (file) formData.append("attachment", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/messages",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);

      socket.emit("sendMessage", {
        appointment_id: selectedAppointment.id,
        receiver_id: chatPartner.id,
        text: newMessage.text || null,
        attachment_url: newMessage.attachment_url || null,
      });

      setInput("");
      setFile(null);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen gap-4 p-2">
      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-2">
          {chatPartner ? (
            <div className="flex items-center space-x-2">
              <img
                src={chatPartner.avatar || profile}
                alt="Partner"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold">{chatPartner.name}</h2>
                <span className="text-green-500 text-xs">
                  {chatPartner.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-xl font-semibold">Select a chat appointment to begin</div>
          )}
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-auto space-y-4 p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end ${
                msg.sender_id === currentUser.id ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender_id !== currentUser.id && (
                <img
                  src={msg.sender?.avatar || profile}
                  alt={msg.sender?.name || "Sender"}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}

              <div
                className={`p-3 text-sm rounded-lg max-w-xs ${
                  msg.sender_id === currentUser.id
                    ? "bg-blue-500 text-white rounded-tl-2xl"
                    : "bg-gray-100 text-gray-800 rounded-tr-2xl"
                }`}
              >
                {msg.text && <div>{msg.text}</div>}
                {msg.attachment_url && (
                  <>
                    {msg.attachment_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={msg.attachment_url}
                        alt="attachment"
                        className="w-32 h-32 object-cover rounded-lg mt-2"
                      />
                    ) : (
                      <a
                        href={msg.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-100 text-xs"
                      >
                        View Attachment
                      </a>
                    )}
                  </>
                )}
              </div>

              {msg.sender_id === currentUser.id && (
                <img
                  src={msg.sender?.avatar || profile}
                  alt="You"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-t items-center">
          <label className="cursor-pointer">
            <IoMdAttach className="w-6 h-6 text-gray-500" title="Attach file" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          <input
            type="text"
            className="flex-1 p-2 bg-gray-100 outline-none rounded-lg focus:border border-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              chatPartner
                ? "Type a message..."
                : "Select a patient to start chatting"
            }
            disabled={!chatPartner}
          />
          <button
            onClick={sendMessage}
            title="Send"
            className="bg-blue-500 text-white p-3 rounded-full cursor-pointer disabled:opacity-50 hover:bg-white hover:text-blue-500 hover:border border-blue-500 "
            disabled={!chatPartner}
          >
            <FiSend />
          </button>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="w-full md:w-1/3 xl:w-1/4 bg-white p-4 shadow-lg rounded-md h-full overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chat Appointments</h2>
        {appointments.map((appointment) => {
          const partner =
            currentUser.role === "doctor"
              ? appointment.patient
              : appointment.doctor;

          return (
            <div
              key={appointment.id}
              onClick={() => setSelectedAppointment(appointment)}
              className="flex items-center gap-3 p-2 mb-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <img
                src={partner?.avatar || profile}
                alt={partner?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-sm font-medium">{partner?.name}</h3>
                <span
                  className={`text-xs ${
                    partner?.online ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {partner?.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          );
        })}
      </aside>
    </div>
  );
};

export default MessageBox;
