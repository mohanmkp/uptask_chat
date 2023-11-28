import { getCookie } from "./cookie";
import { Navigate } from "react-router-dom";
// import axios from 'axios';
// import { ApiURL } from './common';


export async function is_Authenticated(){
    if (getCookie('auth')){
        let auth = JSON.parse(getCookie('auth'))
        // const headers = { 'content-type' : 'application/json', 'Authorization': 'Token '+auth.token };
        // // user profile
        // await axios.get(ApiURL+'/user/profile/', {headers})
        // .then(function (response) {
        //     console.log(response.data)
        //     return true
        // })
        // .catch(function (error) {
        //   console.log(error.response.data);
        //   return false;
        // });
        if(auth.token){
          return true
        }
        return false
    }
    return false
  }



  export const ProtectedRoute = ({ children }) => {
    if (getCookie('auth')){
      let auth = JSON.parse(getCookie('auth'))
      if (auth.token) {
        return children;
      }
      return <Navigate to="/sign-in/" />;
    }
    return <Navigate to="/sign-in/" />;
  };






