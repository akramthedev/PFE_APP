import React, {useState, useEffect} from 'react'
import "./Auth.css";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import LoaderSpin from '../../Assets/spinwhite.svg';
import Status from '../../Components/Status/Status';
import OpenerMp3 from '../../MP3Sounds/openingAuth.wav'



const Auth = () => {

  const navigate = useNavigate();
  const Xplorium = "https://res.cloudinary.com/dqprleeyt/image/upload/v1712318887/and_parkle___3_-removebg-preview_lyfila.png";
  const [isRendered, setisRendered] = useState(false);
  
  const [isAudioReady, setIsAudioReady] = useState(false);
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
          localStorage.setItem('firstConnection', "yes");
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
          const dataNotif = {
            title : "🎉 Welcome to Xplorium! 🎉 ", 
            description1 : `Hello ${fullName}, We're thrilled to have you join our community!`, 
            description2 : "Whether you're here to connect with friends, discover new content, or share your experiences...",
            description3 : "We hope you find Xplorium to be a welcoming and engaging space!",
            description4 : "Best regards,",
            description5 : "Xplorium Team",
            type : "Welcoming", 
            idNotifSentTo : resp.data,
          };
          await axios.post('http://localhost:3001/notif/create', dataNotif)
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


    

    useEffect(() => {

        const timeoutId = setTimeout(() => {
            setisRendered(true);
        }, 666);

        return () => clearTimeout(timeoutId);
    }, []);


  return (
    <div id="x" className='Auth'>

      <img 
        src={Xplorium}
        alt="Xplorium"
        className={isRendered ? "Xplorium showXplorium" : "Xplorium"}
      />
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
        <br />

      </form>

     

    </div>
  )
}

export default Auth