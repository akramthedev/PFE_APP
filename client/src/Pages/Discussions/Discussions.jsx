import React, {useState, useEffect} from 'react'
import './index.css';
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import Room from './Room';
import SideBar from './SideBar';
import {useNavigate} from 'react-router-dom'
import Chat from '../Chat/Chat';
import io from 'socket.io-client';
 

const Discussions = ({isFetchingUser, dataUserCurrent, fetchUser}) => {
  
  const socket = io.connect('http://localhost:3001/');


  const [renderX, setrenderX] = useState(false);


  const nav = useNavigate();
  const [ChatEntered,setChatEntered] = useState(null);
  const [dataUserEntered,setdataUserEntered] = useState(null);
  const [render,setrender] = useState(false);

  const [lasMessageSentIntoThisRoom, setlasMessageSentIntoThisRoom] = useState({
    _id : "",
    senderId : "",
    roomId : "",
    message : "",
    sentTo : "",
    isSeen : false,
    createdAt : "",
    updatedAt : "",
  });
   

  const enterChat = (roomId)=>{
    setChatEntered(roomId);
  }

  useEffect(()=>{
    const x = ()=>{
      console.log("Rendering...");
    }
    x();
  }, [dataUserEntered, setdataUserEntered]);
 
    useEffect(() => {
      socket.on('receiveMessage', (data) => {
      
      });
      return () => {
        socket.off('receiveMessage');  
      };
    }, [socket]);
  

  return (
    <div className='ojqdscueqofs'>
        
        <Navbar isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
        <div className='Discussions'> 

          <SideBar renderX={renderX} render={render} socket={socket} ChatEntered={ChatEntered && ChatEntered} enterChat={enterChat} setdataUserEntered={setdataUserEntered} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
          {
            ChatEntered ? 
            <Chat setrenderX={setrenderX} renderX={renderX} render={render} setrender={setrender} socket={socket}  ChatEntered={ChatEntered}  />
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
        
    </div>

  )
}

export default Discussions