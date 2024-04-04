import React, { useState } from 'react'
import './OTPverify.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import LoaderSpin from '../../Assets/spinwhite.svg';
import '../../Components/index.css';



const OTPverify = () => {

    const navigate = useNavigate();

    const [otp, setOtp] = useState(null);
    const [isError, setisError] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [isSent, setisSent] = useState(false);
    const [errorSending, seterrorSending] = useState(false);



    const handleSubmitOtp = async(event)=>{
        event.preventDefault();
        setisError(false);
        setisLoading(true);
        try{
            const idUser = localStorage.getItem('idUser');
            if(otp && idUser){
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
        finally{
            setisLoading(false);
        }
    }
    const reSendOtp = async()=>{
        const idUser = localStorage.getItem('idUser');        
        setisError(false);
        setisSent(true);
        if(idUser && !isSent){
            try{

                const resp = await axios.get(`http://localhost:3001/auth/resendotp/${idUser}`);
                if(resp.status === 200){
                    setOtp("");
                    seterrorSending(false);
                }
                else{
                    setOtp("");
                    seterrorSending(true);
                }
            }
            catch(e){
                setOtp("");
                console.log(e.message);
                seterrorSending(true);
            }
        }
    }


  return (
    <div className='OTPVERIFY' >
       <form className='formLR'  onSubmit={handleSubmitOtp} >
            <div className="rowOne">
                <h1>Please Verify Your Account</h1>
                <p>
                An OTP has been sent. If you didn't find it, please check your spam folder.
                </p>
            </div>
             
            
            <input type="text" placeholder='Enter 7-digit OTP' value={otp} onChange={(e)=>{setisError(false);setisSent(false);setOtp(e.target.value);}} />
             
            <button
                type='submit'
                className={isLoading ? "btnSubmitAuth noPointerEvent" : "btnSubmitAuth"}
                disabled={isLoading}
            >
                Verify
                {
                    isLoading && <img src={LoaderSpin} alt='Loading...'/>
                }
            </button>
            
            <span className='zodq' onClick={reSendOtp}>
                Didn't receive an OTP?&nbsp;&nbsp;<span className="qdhio">Click here</span>
            </span>
       
            {
                <div className={isError ? "Status showStatus" : "Status"}>
                    Invalid OTP
                </div>
            }
            {
                <div className={ isSent ? "Status Status1 showStatus" : "Status Status1"}>
                {
                    errorSending ? <span>OTP sent successfully! Check your mail.</span>
                  :
                  <span className='ssqdufoc'>
                    Oops, something went wrong!
                  </span>
                }
                </div>
            }
       </form>
       
    </div>
  )
}

export default OTPverify