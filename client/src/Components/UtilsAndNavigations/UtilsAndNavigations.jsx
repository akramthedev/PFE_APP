import React, {useState, useEffect, useRef} from 'react'
import './UtilsAndNavigations.css';
import {useNavigate, useLocation } from 'react-router-dom';
import { useTimer } from '../TimeTracker';
import { useSocket } from '../../Helpers/SocketContext';
import '../../Pages/Profile/index.css';
import SinglePageCOmpo from '../SinglePageCompo/SinglePageCompo';
import axios from 'axios';


const UtilsAndNavigations = ({isCreatedPageCLicked, isFetchingUser, dataUserCurrent, setisCreatedPageCLicked}) => {
     const {setTimeToLogout, duration } = useTimer();

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    const [AutomaticLogoutClicked, setAutomaticLogoutClicked] = useState(false);
    const [secondsLogout, setseconds] = useState(0);
    const [minutesLogout, setminutes] = useState(0);
    const [hoursLogout, sethours] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const { socket, onlineUsers } = useSocket();  
    const token = localStorage.getItem('token');


    const [allUsersLenght,setallUsersLenght] = useState(null);

    
    const getAllUsersLength = async()=>{
      try {
        const resp = await axios.get('http://localhost:3001/user/', {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setallUsersLenght(resp.data.length);
        }
        else{
          setallUsersLenght(37)
        }
      } catch (error) {
        setallUsersLenght(37);
        console.log(error);
      }
    }
    
    useEffect(()=>{
      getAllUsersLength();
    }, []);

    useEffect(()=>{
      console.log("Hello ? ");
    }, [isCreatedPageCLicked, setisCreatedPageCLicked]);


    const handleJack = ()=>{
      let durationDisconnection = 0;
      if(secondsLogout === null || parseInt(secondsLogout) === 0){
      }
      else{ 
        durationDisconnection = durationDisconnection + parseInt(secondsLogout);
      }
      if(minutesLogout === null || parseInt(minutesLogout) === 0){
      }
      else{ 
        durationDisconnection = durationDisconnection + (parseInt(minutesLogout) * 60);
      }
      if(hoursLogout === null || parseInt(hoursLogout) === 0){
      }
      else{ 
        durationDisconnection = durationDisconnection + (parseInt(hoursLogout) * 60 * 60);
      }
      setTimeToLogout(durationDisconnection);
    }



  return (
    <>

      
    
    <div className='UtilsAndNavigations' >
      
      <div className="rowX rowXNoHover">
         <div className="connectedBull" />
        <span style={{ color : "limegreen", fontWeight : '500'}} >Members Online&nbsp;&nbsp;:&nbsp;&nbsp;{onlineUsers && socket  && `${onlineUsers }`}{allUsersLenght && <>&nbsp;/&nbsp;{allUsersLenght}</>}</span>
      </div>


      <div className="rowX">
        <div className="xxx">
          <i className='fa-solid fa-clock'></i>
        </div>
        <span>
          Connection Time&nbsp;&nbsp;
          {hours > 0 && `${hours} h`}&nbsp;
          {minutes > 0 && `${minutes} min`}&nbsp;
          {seconds} s
        </span>
      </div>

      <div className="rowX"
        onClick={()=>{
          setAutomaticLogoutClicked(!AutomaticLogoutClicked);
        }}
      >
        <div className="xxx">
          <i className='fa-solid fa-gear'></i>
        </div>
        <span>
          Configure Automatic Logout
        </span>
      </div>
      {
        AutomaticLogoutClicked && 
      <div className="rowX"
      >
        <div className="xxx">
        </div>
        <span style={{color : "white"}} >
        <>{hoursLogout}h {minutesLogout}min {secondsLogout}s</>

        </span>
      </div>
  }
      {
        AutomaticLogoutClicked && 
        <div className="rowX rowXrowXrowX">
          <div className="xxx">
          </div>
          <span>
            
            <>
            <input type="number" value={hoursLogout}  onChange={(e)=>{sethours(e.target.value)}} className='UISFEUIFQFUOD' placeholder='HH' min={0} max={23} />&nbsp;&nbsp;
            <input value={minutesLogout} onChange={(e)=>{setminutes(e.target.value)}} type="number" className='UISFEUIFQFUOD' placeholder='MM' min={0} max={59} />&nbsp;&nbsp;
            <input value={secondsLogout} onChange={(e)=>{setseconds(e.target.value)}}  type="number" className='UISFEUIFQFUOD' placeholder='SS' min={0} max={59} />&nbsp;&nbsp;
            <button 
              onClick={handleJack}
              className={(parseInt(secondsLogout) === 0 && parseInt(minutesLogout) === 0 && parseInt(hoursLogout) === 0 ) || (secondsLogout === null && minutesLogout === null && hoursLogout === null ) ? "uçzsdfusdq" : "uçzsdfusdquçzsdfusdq"}>
              <i className='fa-solid fa-check'></i>
            </button>
            </>
          </span>
        </div>
      }

      
      <div className="rowX"
        onClick={()=>{
          navigate("/");
        }}
      >
        <div className="xxx">
          <i className='fa-solid fa-house'></i>
        </div>
        <span>Home</span>
      </div>

      <div className="rowX"
        onClick={()=>{
          if(dataUserCurrent && !isFetchingUser){
            navigate(`/profile/${dataUserCurrent._id}`);
          }
        }}
      >
        <div className="xxx xxxxxx">
        {
          !isFetchingUser && dataUserCurrent && 
          <img 
            src={dataUserCurrent.profilePic}
            alt="yourprofilePicture"
          />
        }
        </div>
        <span>
        {
          !isFetchingUser && dataUserCurrent && 
          dataUserCurrent.fullName
        }
        </span>
      </div>


      

      <div className="ruler"/>

      <div className="rowX"
        onClick={()=>{
          localStorage.setItem('saved', "true");
          if(dataUserCurrent && !isFetchingUser){
            navigate(`/profile/${dataUserCurrent._id}`);
          }
        }}  
      >
        <div className="xxx">
          <i className='fa-solid fa-bookmark'></i>
        </div>
        <span>Saved Posts</span>
      </div>



     
        {
          (dataUserCurrent && (dataUserCurrent.role=== "adser" || dataUserCurrent.role === "admin")) && 
            <div className="rowX"
              onClick={()=>{
                if(dataUserCurrent && !isFetchingUser){
                  if(dataUserCurrent.role === "admin"){
                    navigate(`/admin/panel`);
                  }
                  else if (dataUserCurrent.role === "adser"){
                    navigate(`/adser/panel`);
                  }
                }
              }}  
            >
            <div className="xxx">
              <i className='fa-solid fa-chart-line'></i>
            </div>
            <span>Dashboard</span>
          </div>
        }
       
      <div className="rowX rowXNoHover">
        <div className="xxx">
          <i className='fa-solid fa-scroll'></i>
        </div>
        <span>Pages</span>
      </div>
      
        <div className="rowJaja">
          
          
          {
            dataUserCurrent && 
            <>
            {
              dataUserCurrent.pages.length === 0 ? 
              <div className="rowXXrowXX">
                Search for page you may like or even create your own one!
              </div>
              :
              dataUserCurrent.pages.map((page)=>{
                return(
                  <SinglePageCOmpo page={page} />
                )
              })
            }
            </>
          }

         

          <div className="rowX rowXX rowXXrowXX"/>

        </div>
        <div className="rowX rowXNoHover">
          <button className='CreatePage'
            onClick={()=>{
                setisCreatedPageCLicked(true);
            }}
          >
            Create Page
          </button>
        </div>

      <br />
      
      
       
 

        <div className="rowX"
          onClick={()=>{
            localStorage.setItem('saved', "true");
            navigate("/contentpolicy");
          }}  
        >
          <div className="xxx">
            <i className="fa-solid fa-arrows-to-circle"></i>
          </div>
          <span>Content policy</span>
        </div>

        <div className="rowX"
          onClick={()=>{
            localStorage.setItem('saved', "true");
            navigate("/privacypolicy");
          }}  
        >
          <div className="xxx">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <span>Privacy policy</span>
        </div>

        <div className="rowX"
          onClick={()=>{
            localStorage.setItem('saved', "true");
            navigate("/termsofuse");
          }}  
        >
          <div className="xxx">
            <i className='fa-solid fa-book-open'></i>
          </div>
          <span>Terms of use</span>
        </div>


        <div className="rowXXX rowX"
        >
          Xplorium, Inc. © 2024. All rights reserved.
        </div>


    </div>
    </>
  )
}

export default UtilsAndNavigations