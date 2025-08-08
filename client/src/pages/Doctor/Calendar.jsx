import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import { AppointmentDetails } from "../../components";
import { DoctorsAppointment } from "../../components";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openAppointment, setOpenAppointment] = useState(false);

  useEffect(() => {
    const fetchAcceptedAppointments = async () => {
      const userId= sessionStorage.getItem("userId");

      try {

        const  doctorRes= await axios.get(`http://localhost:8080/api/doctors/by-user/${userId}`,{
           headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        });
        const doctorId = doctorRes.data.doctor_id;
        const res = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}`, {
          headers: {

            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        console.log("Full Axios response:", res);
        console.log("Full response data:", res.data)
      if (!Array.isArray(res.data)) {
        console.error("Expected an array but got:", res.data);
        return;
      }
        const acceptedEvents = res.data
          .filter((appt) => appt.status === "confirmed")
          .map((appt) => ({
            id: appt.id.toString(),
            title:`${appt.patient?.name ?? "Patient"}- ${appt.department ?? "Appointment"}`,
            start: appt.appointment_time,
            extendedProps: {
              ...appt,
            },
          }));
        setEvents(acceptedEvents);
      } catch (error) {
        console.log("Failed to fetch the appointments:", error);
      }
    };
    fetchAcceptedAppointments();
  }, []);

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="bg-blue-100 text-blue-500 rounded-md px-2 py-1 text-sm font-medium truncate cursor-pointer">
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <div className="relative mx-4">
      <div className="flex justify-between items-center my-2">
        <h1 className="text-4xl font-bold font-mono">Calendar</h1>
        <button
          type="button"
          onClick={() => setOpenAppointment(true)}
          className="bg-blue-500 text-white py-1 px-4 rounded-lg font-semibold border-blue-500 hover:text-blue-500 hover:bg-white border"
        >
          Requested Appointments
        </button>
      </div>

      <div className="h-[85vh] overflow-y-auto bg-white rounded-lg shadow mt-4 p-2">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          eventContent={renderEventContent}
        />
      </div>

      {openAppointment && (
        <DoctorsAppointment onClose={() => setOpenAppointment(false)} />
      )}

      {selectedEvent && (
        <AppointmentDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Calendar;
