import React, {useState, useEffect} from 'react'
import "./Auth.css";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import LoaderSpin from '../../Assets/spinwhite.svg';
import Status from '../../Components/Status';


const Auth = () => {

  const navigate = useNavigate();

  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alreadyAccount, setalreadyAccount] = useState(true);
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
            navigate('/auth/verify-email');
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
          navigate("/auth/verify-email");
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
        className={alreadyAccount ? "formLR" : "formLR extendsForm"}
      >

        {/*<div className="rowZero" />*/}
        <div className="rowOne">
          <h1>
          {
            !alreadyAccount ? "Create an account" : "Sign in" 
          }
          </h1>
          
        </div>
         
        <input 
            type="text" 
            placeholder='Your Full Name' 
            value={fullName} 
            onChange={(event)=>{
              setfullName(event.target.value);
              seterror({
                status : null, 
                isEnabled : false, 
              });
            }}
            className={!alreadyAccount ? "showIt inputFullName" : "inputFullName"}
        />
        
        <input 
          type="text" 
          placeholder='Your Email Address' 
          value={email} 
          onChange={(event)=>{
            setEmail(event.target.value);
            seterror({
              status : null, 
              isEnabled : false, 
            })
          }} 
        />
        <input 
          type="password" 
          placeholder='Your Password' 
          value={password} 
          onChange={(event)=>{
            setPassword(event.target.value);
            seterror({
              status : null, 
              isEnabled : false, 
            })
          }} 
        />
        <button
          type='submit'
          className={isLoading ? "btnSubmitAuth noPointerEvent" : "btnSubmitAuth"}
          disabled={isLoading}
        >
          {
            alreadyAccount ? 
            <>
                Login
                {
                  isLoading && <img  src={LoaderSpin}  alt='loading...' />
                }
            </> :
            <>
                Register
                {
                  isLoading && <img  src={LoaderSpin}  alt='loading...' />
                }
            </>
          }


        </button>
        <p className='zjfd'>
          {
            !alreadyAccount ? 
            <>Already an account?&nbsp;&nbsp;<span onClick={()=>{setalreadyAccount(!alreadyAccount);seterror({status : null, isEnabled : false});setEmail("");setPassword("");setfullName("");}} className="linkSpan">Log in</span></> : 
            <>No Account?&nbsp;&nbsp;<span onClick={()=>{setalreadyAccount(!alreadyAccount);seterror({status : null, isEnabled : false});setEmail("");setPassword("");}} className="linkSpan">Create one </span></>
          }
        </p>
     
        <Status
          alreadyAccount={alreadyAccount}
          status={error.status}
          isEnabled={error.isEnabled}
        />

      </form>

     

    </div>
  )
}

export default Auth