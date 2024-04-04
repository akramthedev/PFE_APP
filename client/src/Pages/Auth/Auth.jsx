import React, {useState, useEffect} from 'react'
import "./Auth.css";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


const Auth = () => {

  const navigate = useNavigate();

  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alreadyAccount, setalreadyAccount] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState({
    status : null, 
    isEnabled : false, 
  });


  const handleSubmit = async(event)=>{
    event.preventDefault();
    seterror({
      status : null, 
      isEnabled : false, 
    });
    setisLoading(true);
    try{
      if(alreadyAccount){
        const resp = await axios.post('http://localhost:3001/auth/login',{
          email : email, 
          password : password
        });
        if(resp.status === 200){
          localStorage.setItem('token', resp.data.token);
          localStorage.setItem('idUser', resp.data._id);
          navigate(0);
        }
        else {
          if(resp.status === 266){
            localStorage.removeItem("idUser");
            localStorage.setItem('idUser', resp.data);
            navigate('/verify-email');
          }
          else{
            seterror({
              status : resp.status, 
              isEnabled : true, 
            });
          }
        }
      }
      else{
        const resp = await axios.post('http://localhost:3001/auth/register',{
          fullName : fullName, 
          email : email, 
          password : password
        });
        if(resp.status === 200){
          localStorage.setItem('idUser', resp.data);
          navigate("/verify-email");
        }
        else {
          seterror({
            status : resp.status, 
            isEnabled : true, 
          });
        }
      }
    }
    catch(e){
      seterror({
        status : 500, 
        isEnabled : true, 
      });
    } 
    finally{
      setisLoading(false);
    }
  }


 

  return (
    <div className='Auth'>
      <form
        onSubmit={handleSubmit}
      >
        {
          !alreadyAccount && 
          <input 
            type="text" 
            placeholder='Full Name' 
            value={fullName} 
            onChange={(event)=>{
              setfullName(event.target.value);
            }} 
          />
        }
        <input 
          type="text" 
          placeholder='Email Address' 
          value={email} 
          onChange={(event)=>{
            setEmail(event.target.value);
          }} 
        />
        <input 
          type="password" 
          placeholder='Password' 
          value={password} 
          onChange={(event)=>{
            setPassword(event.target.value);
          }} 
        />
        <button
          type='submit'
          className='btnSubmitAuth'
          disabled={isLoading}
        >
          {
            isLoading ? "Processing...":
            <>
            {
              alreadyAccount ? "Login" : "Register"
            }
            </>
          }
        </button>
        <p>
          {
            !alreadyAccount ? 
            <span onClick={()=>{setalreadyAccount(!alreadyAccount);setEmail("");setPassword("");setfullName("");}} className="linkSpan">Already an account? Log in</span> : 
            <span onClick={()=>{setalreadyAccount(!alreadyAccount);setEmail("");setPassword("");}} className="linkSpan">No Account? Create one </span>
          }
        </p>
        <p>
        {
          error.isEnabled &&
          <>{error.status}&nbsp;|&nbsp;{error.msg}</>
        }
        </p>
      </form>
      
    </div>
  )
}

export default Auth