import React, {useState, useEffect} from 'react'
import "./index.css";
import axios from 'axios';
import io from 'socket.io-client';
import {useNavigate } from "react-router-dom";

const Chat = ({ChatEntered, fetchUser, dataUserCurrent, isFetchingUser}) => {

  const socket = io.connect('http://localhost:3001/');

  const [loading, setloading] = useState(true);
  const [entered, setentered] = useState(false);
  const token = localStorage.getItem('token')
  const idUser = localStorage.getItem('idUser');
  const nav = useNavigate();

  
  const EnterConversation = ()=>{
      let data = {
        idRoom : ChatEntered, 
        idWhoEnter : idUser
      }
      socket.emit("EnterConvWithFriend", data);
  }


  useEffect(()=>{
    EnterConversation();
  }, []);


  useEffect(() => {
    socket.on('Entered-Successfully', () => {
      setentered(true);
    });
    return () => {
      socket.off('Entered-Successfully');  
    };  
  }, [socket]);

  return (
    <>
    { 
      (!isFetchingUser && dataUserCurrent && ChatEntered )&&
      <div className='chatEntered'>
      {
        entered && 
        <div className='singleChat'>
          Welcome to Room : {ChatEntered}
        </div>
      }
      </div>
    }
    </>
  )
}

export default Chat