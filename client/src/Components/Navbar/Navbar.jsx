import React, {useState, useEffect, useRef} from 'react'
import "./Navbar.css";
import {useNavigate, useLocation} from 'react-router-dom';
import useOutsideAlerter  from '../../Helpers/HidePopUp';
import { useSocket } from '../../Helpers/SocketContext';
import axios from 'axios';


const Navbar = ({ dataUserCurrent, isFetchingUser}) => {

    const navigate = useNavigate();
    const popupRef = useRef(null);  
    const location = useLocation();
    const {pathname} = location;
    const { socket, onlineUsers } = useSocket();
    const token = localStorage.getItem("token");  
    const idUser = localStorage.getItem("idUser");  
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [unSeenNotifs, setunSeenNotifs] = useState(0);
    const [requestNumber, setrequestNumber] = useState(0);


    useOutsideAlerter(popupRef, setIsProfileClicked);

    const fetchUnseenNotifNumber = async()=>{
        try{
            if(idUser){
                const resp = await axios.get(`http://localhost:3001/notif/getUnseen/${idUser}`);
                if(resp){
                    setunSeenNotifs(resp.data.length);
                }
            }
        }
        catch(e){
            console.log(e.message);
        }
    }

    const fetchReqNumber = async()=>{
        try{
            if(idUser){
                const resp = await axios.get(`http://localhost:3001/request/user/${idUser}`);
                if(resp){
                    setrequestNumber(resp.data.length);
                }
            }
        }
        catch(e){
            console.log(e.message);
        }
    }
 

    useEffect(() => {
        
        const intervalId = setInterval(() => {
            if(pathname === "/notifications"){
                setunSeenNotifs(0);
            }
            else{
                fetchUnseenNotifNumber();
            }
            fetchReqNumber();
        }, 1000); 

        return () => clearInterval(intervalId);
      }, []); 
      

    const handleLogout = ()=>{
        socket.emit("logoutAndQuitGR");
        setTimeout(()=>{
            localStorage.removeItem('idUser');
            localStorage.removeItem('token');
            navigate(0);
        },100);
    }


    

  return (
    <div className='Navbar' >
        <div className="part1">
            <img 
                title='Xplorium' 
                src='https://res.cloudinary.com/dqprleeyt/image/upload/v1712318887/and_parkle___3_-removebg-preview_lyfila.png'
                alt=""
                onClick={()=>{
                    
                    navigate("/");
                }}
            />
        </div>
        <div className="part2121">
            <form className="searchUser">
                <button type='submit' className='search' ><i className="fa-solid fa-magnifying-glass"></i></button>
                <input type="text" placeholder='Search...' />
            </form>
        </div>
        <div className="part2">
            <div className={dataUserCurrent && dataUserCurrent.role !== "user" ? "part2p1 part2p1admin": "part2p1"}>
 
               

                <button 
                    onClick={()=>{navigate('/requests');}}
                    className='linkNav'
                >
                     {
                        requestNumber !== 0 && 
                        <div className="bulle">
                            {requestNumber}
                        </div>
                     }
                    <i className="fa-solid fa-user-group"></i>
                </button>

                <button 
                    onClick={()=>{navigate('/notifications');}}
                    className='linkNav'
                >
                    {
                        unSeenNotifs !== 0 && 
                        <div className="bulle">
                            {unSeenNotifs}
                        </div>
                    }
                    <i className="fa-solid fa-bell"></i>
                </button>

                <button 
                    onClick={()=>{navigate('/discussions');}}
                    className='linkNav'
                >
                    <div className="bulle">
                        6
                    </div>
                    <i className="fa-solid fa-envelope"></i>
                </button>
                
                {
                    (dataUserCurrent && (dataUserCurrent.role === "admin" || dataUserCurrent.role === "adser") ) &&
                    <button 
                        onClick={
                        ()=>{
                            if(dataUserCurrent && dataUserCurrent.role === "admin"){
                                navigate('/admin/panel')
                            }
                            else{
                                navigate('/adser/panel');
                            }
                        }}
                        className='linkNav'
                    >
                        <i className="fa-solid fa-chart-line"></i>
                    </button>
                }

                

            </div>
            <div
                className="part2p2"
            >
                {
                    (dataUserCurrent && !isFetchingUser) &&
                    <img 
                        src={dataUserCurrent.profilePic}
                        alt="Profile" 
                        onClick={()=>{setIsProfileClicked(!isProfileClicked);}}
                        key={isProfileClicked ? 123 : 321}
                    /> 
                }
                {isProfileClicked ? <i  className='fa-solid fa-angle-up'></i> : <i  className='fa-solid fa-angle-down'></i>}
                <div
                    className={
                        isProfileClicked ? "showPopUp popUp" : "popUp"
                    }
                    ref={popupRef}
                >
                    <div className="rowjh"
                        onClick={()=>{
                            if(dataUserCurrent){
                                navigate(`/profile/${dataUserCurrent._id}`);
                                setIsProfileClicked(!isProfileClicked);
                            }
                        }}
                    >
                        <div className="caseOne">
                        {
                            (dataUserCurrent && !isFetchingUser) &&
                            <img src={dataUserCurrent.profilePic} alt="" />
                        }
                        </div>
                        <div className="caseTwo">
                        {
                            (dataUserCurrent && !isFetchingUser) &&
                            dataUserCurrent.fullName    
                        }
                        </div>
                    </div>
                    <div className="rowjh"
                        onClick={()=>{
                            navigate("/settings");
                            setIsProfileClicked(!isProfileClicked);
                        }}
                    >
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-gear"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Setting & Privacy
                        </div>
                    </div>
                    <div className="rowjh"
                        onClick={()=>{
                            navigate("/help");
                            setIsProfileClicked(!isProfileClicked);
                        }}
                    >
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-circle-info"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Help & Support 
                        </div>
                    </div>
                    <div className="rowjh"
                        onClick={()=>{
                            navigate("/accessibility");
                            setIsProfileClicked(!isProfileClicked);
                        }}
                    >
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-universal-access"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Display & Accessibility 
                        </div>
                    </div>
                    <div className="rowjh"
                        onClick={()=>{
                            handleLogout();
                        }}
                    >
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Sign out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar