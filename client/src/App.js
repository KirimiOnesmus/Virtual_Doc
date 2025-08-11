import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import Register from "./components/Registration/Register";
import Login from "./components/Registration/Login";
import {ProfilePage} from "./components";
import DoctorRegistration from "./components/Registration/DoctorRegistration";
import {
  Dashboard,
  Overview,
  Calendar,
  AppoinmentList,
  MessageBox,
  Doctors,
  Appointments,
  PatientDetails,
  PaymentPage,
  ManageWeek,
  Schedule,
} from "./pages/index";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/profilePage/:userId" element={<ProfilePage />} /> */}

        {/* Nesting the dashboard layout */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
           <Route path="schedule" element={<Schedule/>}/>
           <Route path="schedule/manage-week" element={<ManageWeek />} />
          <Route path="schedule/calendar" element={<Calendar />} />
          <Route path="patients" element={<AppoinmentList />} />
          <Route path="messages" element={<MessageBox />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="patient-details/:id" element={<PatientDetails />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="DoctorRegistration" element={<DoctorRegistration />} />
        </Route>

      </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </div>
  );
}

export default App;
