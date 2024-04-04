import React, {useState, useEffect} from 'react'
import "./Auth.css";
import axios from 'axios';

const Auth = () => {

  const sendMail = async ()=>{
    try{
      await axios.get('http://localhost:3001/auth/sendMail');
    }
    catch(e){
      console.log(e.message);
    }
  }

  return (
    <div className='Auth'>
      Auth Page
      <button
        onClick={sendMail}
      >
        Send Mail
      </button>
    </div>
  )
}

export default Auth