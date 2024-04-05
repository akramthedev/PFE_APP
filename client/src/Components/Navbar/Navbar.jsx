import React, {useState, useEffect, useRef} from 'react'
import "./Navbar.css";
import {useNavigate} from 'react-router-dom';
import useOutsideAlerter  from '../../Helpers/HidePopUp';


const Navbar = () => {

    const navigate = useNavigate();
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const popupRef = useRef(null);  

    useOutsideAlerter(popupRef, setIsProfileClicked);


  return (
    <div className='Navbar' >
        <div className="part1">
            <img 
                title='Xplorium' 
                src="https://res.cloudinary.com/dqprleeyt/image/upload/v1712276227/and_parkle___2_-removebg-preview_b0dfnq.png" 
                alt=""
                onClick={()=>{
                    navigate("/");
                    navigate(0);
                }}
            />
            
            <form className="searchUser">
                <button type='submit' className='search' ><i className="fa-solid fa-magnifying-glass"></i></button>
                <input type="text" placeholder='Xplore for a friend...' />
            </form>
            
        </div>
        <div className="part2">
            <div className="part2p1">
 
               

                <button 
                    onClick={()=>{navigate('/')}}
                    className='linkNav'
                >
                     <div className="bulle">
                        1
                    </div>
                    <i className="fa-solid fa-user-group"></i>
                </button>

                <button 
                    onClick={()=>{navigate('/')}}
                    className='linkNav'
                >
                    <div className="bulle">
                        4
                    </div>
                    <i className="fa-solid fa-bell"></i>
                </button>

                <button 
                    onClick={()=>{navigate('/')}}
                    className='linkNav'
                >
                    <div className="bulle">
                        6
                    </div>
                    <i className="fa-solid fa-envelope"></i>
                </button>

            </div>
            <div className="part2p2">
                <img 
                    onClick={()=>{setIsProfileClicked(!isProfileClicked);}}                    
                    src="https://t3.ftcdn.net/jpg/05/59/53/30/360_F_559533081_YXhuGfGC6ebbwr7eubkPr2HKeKTvNEAQ.jpg" 
                    alt="Profile" 
                    key={isProfileClicked ? 123 : 321}
                />
                <div
                    className={
                        isProfileClicked ? "showPopUp popUp" : "popUp"
                    }
                    ref={popupRef}
                >
                    <div className="rowjh">
                        <div className="caseOne">
                            <img src="https://t3.ftcdn.net/jpg/05/59/53/30/360_F_559533081_YXhuGfGC6ebbwr7eubkPr2HKeKTvNEAQ.jpg" alt="" />
                        </div>
                        <div className="caseTwo">
                            Akram El Basri
                        </div>
                    </div>
                    <div className="rowjh">
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-gear"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Setting & Privacy
                        </div>
                    </div>
                    <div className="rowjh">
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-circle-info"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Help & Support 
                        </div>
                    </div>
                    <div className="rowjh">
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-universal-access"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Display & Accessibility 
                        </div>
                    </div>
                    <div className="rowjh">
                        <div className="caseOne caseOne2">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </div>
                        <div className="caseTwo caseTwo2">
                            Sing out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar