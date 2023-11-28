import React, { useEffect, useState } from 'react'
import { Navbar } from './services/navbar';
import { useRef } from 'react';
import axios from 'axios';
import { ApiURL } from './services/common';
import { getCookie } from './services/cookie';
import { MessageMap } from '../ChatService/MessageMap';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import "./style/chatmessage.css"
import { ReceiveMsgMap } from '../ChatService/ReceiveMsgs';


export const ChatMessage = (props) => {
    const [load,setLoad] = useState(false)
    const [userEmail, setUserEmail] = useState(null)
    const [userProfile, setUserProfile] = useState({})
    const [chatMsg, setChatMsg] = useState(null)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [ws, setWs] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);

    const ref = useRef(null);
    const scrollToLast = () => {
        const lastChildElement = ref.current?.lastElementChild;
        lastChildElement?.scrollIntoView();
      };


      useEffect(()=>{
        setMessages(props.messages)
        setShowEmojis(false)
        setWs(props.ws)
        setUserEmail(props.activeUser.receiver)   
        setTimeout(() => {
          scrollToLast()
        }, 5);    
      }, [props])

    useEffect(() => { 
      setLoad(false)
      setMessages([])
      const auth = JSON.parse(getCookie('auth'))
      const headers = { 'content-type' : 'application/json', 'Authorization': 'Token '+auth.token };
      if(userEmail){
         // user profile
      axios.get(ApiURL+'/user/profile/?email='+userEmail, {headers})
      .then(function (response) {
        setUserProfile(response.data)
      })
      .catch(function (error) {
        console.log(error.response.data);
      });

        //  chat message or conversation
        axios.get(ApiURL+'/chat/message/?receiver='+userEmail, {headers})
        .then(function (response) {
          setChatMsg(response.data)
          setLoad(true)
          setTimeout(() => {
            scrollToLast()
          }, 10);
        })
        .catch(function (error) {
          console.log(error.response.data);
        });
      
      }
     
    },[userEmail]);
 
    // socket handler    

    const handleSendMessage = () => {
      if (ws && newMessage.trim() !== '') {
        // Send a message to the WebSocket server
        const message = {message:newMessage, to:userEmail}
        ws.send(JSON.stringify(message));
        setNewMessage('');
      }
    };

    const addEmoji = (e) => {
      let sym = e.unified.split("-");
      let codesArray = [];
      sym.forEach((el) => codesArray.push("0x" + el));
      let emoji = String.fromCodePoint(...codesArray);
      setNewMessage(newMessage + emoji);
    };


  return (
    <>

    

    {load ? 
    <div className="flex flex-col flex-auto h-full p-6">
    <Navbar userProfile={userProfile} />
    
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white h-40 p-4">
      <div className="flex flex-col h-full overflow-x-auto mb-4 ">
        <div className="flex flex-col w-full h-full">
          
          <div className="grid grid-cols-12 w-full gap-y-2" ref={ref}>
        
          <div className="col-7xl p-3 rounded-lg">
              <div className="flex items-center justify-start flex-row-reverse">
                <div className="flex items-center justify-center  w-10 rounded-full flex-shrink-0">
                </div>
                <div className="relative mr-3 px-4 rounded-xl">
                </div>
              </div>
            </div>

            {chatMsg && MessageMap(chatMsg)}
           
            {/* incomming messages */}
            {messages && ReceiveMsgMap(messages)}
            {/* end incomming msg */}

          

          </div>
        </div>
      </div>
      <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
        <div>
          <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
        </div>
        {showEmojis && (
            <div className='emoji-div'>
            <Picker data={data} onEmojiSelect={addEmoji} className="picker-div" />
         </div>
          )}
        <div className="flex-grow ml-4">
          <div className="relative w-full">
            <textarea 
             rows="1"
            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 p h-auto"
             onChange={(e) => setNewMessage(e.target.value)} value={newMessage}>{newMessage}</textarea>

              {/* <input
              type="text"
              value={newMessage}
              
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
            />
           */}
            <button onClick={() => setShowEmojis(!showEmojis)} className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setShowEmojis(!showEmojis)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="ml-4">
          <button onClick={handleSendMessage} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-5 py-3 flex-shrink-0">
            <span className="ml-2">
              <svg
                className="w-4 h-4 transform rotate-45 -mt-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </span>
          </button>

     
        </div>
      </div>
    </div>
  </div> : " " 
      }
  </>
  )
}
