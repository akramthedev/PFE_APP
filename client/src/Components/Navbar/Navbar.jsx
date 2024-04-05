import React, {useState, useEffect, useRef} from 'react'
import "./Navbar.css";
import {useNavigate} from 'react-router-dom';
import useOutsideAlerter  from '../../Helpers/HidePopUp';


const Navbar = ({socket}) => {

    const navigate = useNavigate();
    const popupRef = useRef(null);  
    const token = localStorage.getItem("token");  
    const idUser = localStorage.getItem("idUser");  
    const [isProfileClicked, setIsProfileClicked] = useState(false);
   


    useOutsideAlerter(popupRef, setIsProfileClicked);


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
                    navigate(0);
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
            <div className="part2p1">
 
               

                <button 
                    onClick={()=>{navigate('/requests')}}
                    className='linkNav'
                >
                     <div className="bulle">
                        1
                    </div>
                    <i className="fa-solid fa-user-group"></i>
                </button>

                <button 
                    onClick={()=>{navigate('/notifications')}}
                    className='linkNav'
                >
                    <div className="bulle">
                        4
                    </div>
                    <i className="fa-solid fa-bell"></i>
                </button>

                <button 
                    onClick={()=>{navigate('/discussions')}}
                    className='linkNav'
                >
                    <div className="bulle">
                        6
                    </div>
                    <i className="fa-solid fa-envelope"></i>
                </button>

            </div>
            <div
                className="part2p2"
            >
                <img 
                    src="https://akramelbasri.com/static/media/img.bbbb721ddafd04f09a9d.png" 
                    alt="Profile" 
                    onClick={()=>{setIsProfileClicked(!isProfileClicked);}}
                    key={isProfileClicked ? 123 : 321}
                />
                {isProfileClicked ? <i  className='fa-solid fa-angle-up'></i> : <i  className='fa-solid fa-angle-down'></i>}
                <div
                    className={
                        isProfileClicked ? "showPopUp popUp" : "popUp"
                    }
                    ref={popupRef}
                >
                    <div className="rowjh"
                        onClick={()=>{
                            navigate("/profile/666");
                        }}
                    >
                        <div className="caseOne">
                            <img src="https://akramelbasri.com/static/media/img.bbbb721ddafd04f09a9d.png" alt="" />
                        </div>
                        <div className="caseTwo">
                            Akram El Basri
                        </div>
                    </div>
                    <div className="rowjh"
                        onClick={()=>{
                            navigate("/settings");
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