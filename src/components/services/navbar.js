import React, { useEffect, useState } from 'react'
import { deleteCookie } from './cookie'
import { useNavigate } from "react-router-dom";
import { uptask_url } from './common';

export const Navbar = (props) => {
    const navigate = useNavigate();
    const [load, setLoad]=useState(false)
    const [userProfile, setUserProfile]= useState(null)
    const colors = ["indigo", "gray", "red", "orange", "pink", "purple"]

    useEffect(()=>{
      setUserProfile(props.userProfile)
        setLoad(true)
      
    },[props, userProfile])

    function Logout(){
        deleteCookie("auth")
        navigate("/sign-in/");
    }

  return (
    <>
     <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <div className="flex items-center">
      {load && userProfile.profile_pic ?
       <img
       src={uptask_url+userProfile.profile_pic}
       className="h-14 w-14 mr-3 rounded-full border-solid border "
       alt="user Profile"
     />:
     <div className={`flex items-center justify-center h-14 w-14 mr-3 bg-${colors[Math.floor(Math.random()*colors.length)]}-200 rounded-full capitalize`}>
     {userProfile && userProfile.first_name? <>{userProfile.first_name.slice(0,1)} </>:""}
   </div>
     }
     
      <span className="self-center font-semibold whitespace-nowrap dark:text-white">
        {load && <><p className='capitalize'>{userProfile.first_name} {userProfile.last_name}</p>
        <p className='text-xs capitalize'>{userProfile.job_title}</p></>}
      </span>
    </div>
   
    <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2  w-8 h-8 rounded-full" title='Sign out' onClick={Logout}>
         <svg class="w-4 h-4 text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
        </svg>
      </button>
    </div>
  </div>
</nav>

    </>
  )
}

