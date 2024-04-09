import React, {useState, useEffect} from 'react'
import './index.css';
import axios from 'axios';
import Room from './Room';
import SideBar from './SideBar';
import {useNavigate} from 'react-router-dom'
import Chat from '../Chat/Chat';




const Discussions = ({isFetchingUser, dataUserCurrent, fetchUser}) => {

  const nav = useNavigate();
  const [ChatEntered,setChatEntered] = useState(null);
  const [dataUserEntered,setdataUserEntered] = useState(null);


  const enterChat = (roomId)=>{
    setChatEntered(roomId);
  }

  useEffect(()=>{
    const x = ()=>{
      console.log("Rendering...");
    }
    x();
  }, [dataUserEntered, setdataUserEntered]);

  return (
    <div className='Discussions'> 
      <SideBar ChatEntered={ChatEntered && ChatEntered} enterChat={enterChat} setdataUserEntered={setdataUserEntered} />
      {
        ChatEntered ? 
        <Chat dataUserEntered={dataUserEntered} dataUserCurrent={dataUserCurrent} ChatEntered={ChatEntered} isFetchingUser={isFetchingUser}  fetchUser={fetchUser}  />
        :
        <div className="ChatProvisoire">
          <img src="https://res.cloudinary.com/dqprleeyt/image/upload/v1712318887/and_parkle___3_-removebg-preview_lyfila.png" alt="" />
          <span>
          Embark on a Journey of Connection, Sharing, and Networking: Where Boundless Opportunities Converge at Your Command!
          </span>
          <span className="chifré">
          <i className='fa-solid fa-lock'></i>&nbsp;&nbsp;End-to-end encrypted
          </span>
        </div>
      }
    </div>
  )
}

export default Discussions