import React, {useState, useEffect, useMemo}  from 'react'
import "../index.css"
import { ChatMessage } from './ChatMessage';
import { SideBar } from './SideBar';
import { DefaultChat } from './DefautlMessage';
import { socket_url } from './services/common';
import { getCookie } from './services/cookie';
import audiofile from '../static/H42VWCD-notification.mp3'
import axios from 'axios';
import { ApiURL } from './services/common';


function Home() {
  const [user,setUser]= useState(null)
  const [is_message,setMessage]= useState(false)
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState({});
 

  const audio = useMemo(() => { 
    return new Audio(audiofile);
    }, []);

    
  

  useEffect(()=>{
    setMessages([])
    setNewMessages({})
 
    
  }, [user])

//   window.onblur = function () {
//     // tab is changed
//     console.log(" tab is changed")
//  };
//  window.onfocus = function () {
//     // tab is active
//     console.log(" tab is changed")
//  };
  


   useEffect(()=>{
    const PreMessage= (newMessages)=>{
      const AllMessage = [...messages, newMessages];
      setMessages(AllMessage);
      setNewMessages({})
    }
    if(Object.keys(newMessages).length !== 0){
      PreMessage(newMessages)
    } 
    // eslint-disable-next-line
   },[newMessages]) 
 
    
  //  Message handler 
  useEffect(() => {
    let auth = JSON.parse(getCookie('auth'))
    const HandleNotification = (email, message)=>{
      const headers = { 'content-type' : 'application/json', 'Authorization': 'Token '+auth.token };
      let postdata = {email:email,last_message:message}
      if(auth.email !== email){
        axios.post(ApiURL+'/notification/', postdata, {headers})
        .then(function (response) { 
          console.log(response.data)
          audio.play()
          setMessage((current) => !current)

        })
        .catch(function (error) {
          console.log(error.response.data);
        });
       }
     
    }

    // socket
    const socket = new WebSocket(socket_url+`/chat/${auth.token}/`);
    socket.addEventListener('open', () => {
      console.log('WebSocket connected');
    }); 
    socket.addEventListener('message', (event) => {
      // Handle incoming messages
      console.log(event.data)
      const validJsonString = event.data.replace(/'/g, '"');
      const r_msg = JSON.parse(validJsonString)
      setMessage((current) => !current)
      if(user){
        if(r_msg.sender === user.receiver || user.sender === r_msg.sender){
          // const newMessages = [...messages, r_msg];
          // const newMessages = [r_msg];
          // setMessages(newMessages);
          // PreMessage(r_msg)
          setNewMessages(r_msg)
        }else{
          HandleNotification(r_msg.sender, r_msg.message)
          console.log("add notification")
        }
      }
      else if(user === null){
          HandleNotification(r_msg.sender, r_msg.message)
        
        console.log(user)
        console.log("notification")
      }
    
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    setWs(socket);
    return () => {
      socket.close();
    };
  }, [user, audio])





  return (
    <>
   
    <div className='className="h-screen overflow-hidden flex items-center justify-center"'>
    <div className="flex h-screen antialiased text-gray-800">
    <div className="flex flex-row h-full w-full overflow-x-hidden ">
        <SideBar  setActiveUser={setUser} is_message={is_message} />
        {user ?  <ChatMessage activeUser={user} messages={messages} ws={ws} /> : <DefaultChat/>}
        
    </div>
    </div>
    </div>
    </>
  )
}

export default Home