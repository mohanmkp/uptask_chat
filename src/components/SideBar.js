import React , { useCallback } from 'react'
import Logoimg from "../images/logo.png"
import { useEffect, useState } from 'react'
import axios from 'axios';
import { ApiURL, uptask_url } from './services/common';
import { getCookie } from './services/cookie';
import {  useNavigate } from 'react-router-dom';

export const SideBar = ({ setActiveUser, is_message }) => {
  const navigate = useNavigate();
    const [user_data, setUserdata] = useState(null)
    const [recent_chat, setRecentChat] = useState(null)
    const [receiverEmail, setReceiverEmail] = useState(null)
    const colors = ["indigo", "gray", "red", "orange", "pink", "purple"]



    useEffect(()=>{
        const auth = JSON.parse(getCookie('auth'))
        const headers = { 'content-type' : 'application/json', 'Authorization': 'Token '+auth.token };
        // user profile
        axios.get(ApiURL+'/user/profile/', {headers})
        .then(function (response) {
            setUserdata(response.data)
        })
        .catch(function (error) {
          console.log(error.response.data);
          navigate("/sign-in/",{ replace: true });
        });

      

    },[navigate])

    useEffect(()=>{
        const auth = JSON.parse(getCookie('auth'))
        const headers = { 'content-type' : 'application/json', 'Authorization': 'Token '+auth.token };
        // connection or recent chat
        axios.get(ApiURL+'/user/connection/', {headers})
        .then(function (response) {
            setRecentChat(response.data)
        })
        .catch(function (error) {
          console.log(error.response.data);
        });
    },[is_message, receiverEmail])
    

    const selectUser = useCallback(email => {
      setActiveUser({"receiver": email, "sender": user_data.email})
      setReceiverEmail(email)
    }, [setActiveUser, user_data])

  return (
    <>
     <div className="flex flex-col py-8 pl-6 pr-2 w-80 bg-white flex-shrink-0">
      <div className="flex flex-row items-center justify-center h-12 w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
            <img src={Logoimg}   className="w-14 h-10" alt='logo'/>
          
        </div>
        <div className="ml-2 font-bold text-2xl">UpTask</div>
      </div>
      
      <div className="flex flex-row items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-4 px-4 rounded-lg">
        <div className="relative h-16 w-16">
          <img
            src={user_data &&  user_data.profile_pic ? uptask_url+user_data.profile_pic:Logoimg}
            alt="Avatar"
            className="h-full w-full rounded-full  border"
          />
              <span class="bottom-2 right-0 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
        </div>
        <div className="text-sm font-semibold ml-2 capitalize">
          {user_data && `${user_data.first_name} ${user_data.last_name}`}

            <p className="text-xs mt-1">
            {user_data && `${user_data.job_title} `}
           </p> 

        </div>  
      </div>

      {/* end user profile */}
      
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center justify-between text-xs">
          <span className="font-bold">Recent chats</span>
          {/* <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
            4
          </span> */}
        </div>


        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-96 overflow-y-auto">
            {recent_chat && recent_chat.map((user) => (
              <>
                  <button className="flex flex-row  hover:bg-gray-100 rounded-xl p-2 my-2" onClick={()=>{selectUser(user.email)}}>
                    {user.profile_pic ? 
                    <img
                    src={uptask_url+user.profile_pic}
                    className="h-14 w-14 rounded-full border"
                    alt="user Profile"
                  />:
                    <div className={`flex items-center justify-center h-14 w-14 bg-${colors[Math.floor(Math.random()*colors.length)]}-200 rounded-full capitalize`}>
                    {user.first_name.slice(0,1)}
                  </div>}
                  <div className="text-sm font-semibold ml-2 block mt-1 text-left">
                    <p className='capitalize'>{user.first_name} {user.last_name}</p>
                    {user.last_message.message ? 
                    <>
                    {user.last_message.message.length > 27 ?
                    <span className='text-xs'>{user.last_message.message.slice(0,27)} ...</span> 
                    :
                    <span className='text-xs'>{user.last_message.message}</span> 
                    }
                    </>
                    : <span className='text-xs'>Say 👋👋</span> }
                    
                  </div>
                  {/* un view msg */}
               
                   {/* notification */}
                  {user.last_message.time && 
                  <div className=" ml-auto text-xs text-green-500 h-4 w-15 rounded leading-none mt-2">
                      {user.last_message.created_at === "Today" ?  <>{user.last_message.time}</>: <>{user.last_message.created_at}</>}
          

                      {user.notification.count && <>
                        <div className="flex items-center justify-center ml-auto text-xs text-white bg-blue-500 h-5 w-5 rounded-full leading-none mt-1">
                          {user.notification.count}
                      </div>
                      </>}

                  </div>}
                  {/* end notificaion */}

                 
                 
                </button>
                
                </>
            ))}


        </div>
      </div>
    </div>
    </>
  )
}
