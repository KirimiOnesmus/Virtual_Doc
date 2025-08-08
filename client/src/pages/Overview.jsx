import React,{ useEffect, useState}from 'react'
import 'react-calendar/dist/Calendar.css';
import { useOutletContext } from 'react-router-dom';
import {DoctorOverview,PatientOverview} from '../components';


const Overview = () => {
    const { userData } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const[userRole, setUserRole] = useState(null);
    useEffect(() => {
        if (userData) {
            setLoading(false);
        }
        setUserRole(sessionStorage.getItem('role'));
    }, [userData]);

  return (
    <div className='flex flex-col gap-4'>
      {userRole === "doctor" && (<DoctorOverview userData={userData} /> )}
      {userRole === "patient" && (<PatientOverview userData={userData}/> )}
      {/* {loading && <p>Loading...</p>} */}
        {/* */}
        

        
    </div>
  )
}

export default Overview