import React, { useEffect, useState } from "react";
import Usercontext from "./UserContext";
import axios from 'axios';
import { ApiURL } from "../components/services/common";
import { getCookie } from "../components/services/cookie";

const UserState = (props)=>{
    const [state,setState]= useState()

    useEffect(()=>{
        let auth = JSON.parse(getCookie('auth'))
        if(auth){
            const headers = { 'content-type' : 'application/json', 'Authorization': 'Token '+auth.token };
            axios.get(ApiURL+'/user/profile/', {headers})
            .then(function (response) {
                setState(response.data)
                console.log(response.data)
            })
            .catch(function (error) {
              console.log("invalid user");
              setState(null)
            });
        }
    },[state])

    return (
        <Usercontext.Provider value={state}>
            {props.children}
        </Usercontext.Provider>
    )
}

export default UserState;

