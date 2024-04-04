import React, { useState } from 'react'
import './OTPverify.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';



const OTPverify = () => {

    const navigate = useNavigate();

    const [otp, setOtp] = useState(null);
    const [isError, setisError] = useState(false);

    const handleSubmitOtp = async(EVENT)=>{
        EVENT.preventDefault();
        setisError(false);
        try{
            const idUser = localStorage.getItem('idUser');
            if(otp){
                const resp = await axios.post(`http://localhost:3001/auth/verifyOtp`, {
                    otp : otp, 
                    idUser : idUser
                });
                if(resp.status === 200){
                    localStorage.setItem('token', resp.data);
                    navigate(0);
                }
                else{
                    setisError(true);
                }
            }
        }
        catch(e){
            console.log(e.message);
            setisError(true);
        }
    }
    const reSendOtp = async(EVENT)=>{
        EVENT.preventDefault();
        setisError(false);
        try{
            const idUser = localStorage.getItem('idUser');

            const resp = await axios.get(`http://localhost:3001/auth/resendotp/${idUser}`);
            if(resp.status === 200){
                setOtp("");
                alert('Resent successfully ...');
            }
            else{
                setOtp("");
                alert('Not Sent ...');
            }
        }
        catch(e){
            setOtp("");
            console.log(e.message);
            alert('500 Not Sent ...');
        }
    }


  return (
    <div className='OTPVERIFY' >
       <form  onSubmit={handleSubmitOtp} >
        <h1>Please Verify Your Account</h1>
            <br />
            <p>
                We've sent you an otp to your email 
            </p>
            <input type="text" value={otp} onChange={(e)=>{setOtp(e.target.value);}} />
            <br />
            <button
                type='submit'
            >
                Verify OTP
            </button>
            <br />
            <button
                type='button'
                onClick={reSendOtp}
            >
                You have not received an OTP ? click here
            </button>
       </form>
       <br /><br />
       {
        isError && "Incorrect OTP"
       }
    </div>
  )
}

export default OTPverify