import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ApiURL } from './services/common';
import { setCookie } from './services/cookie';
import { useNavigate } from "react-router-dom";



export const AutoSignin = () => {
    let { email, password } = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        let postdata={
            email : email,
            password: password
        }
        axios.post(ApiURL+'/user/uptask-auth/', postdata)
        .then(function (response) {
            console.log(response.data)
           setCookie("auth", JSON.stringify(response.data), 7); 
          setTimeout(()=>{
              navigate("/",{ replace: true });
          }, 2000)
        })
        .catch(function (error) {
            navigate("/sign-in/",{ replace: true });
        });

    },[email,password, navigate])

  return (
    <div>Auto Sign in</div>
  )
}


