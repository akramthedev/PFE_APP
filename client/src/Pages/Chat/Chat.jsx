import React, {useState, useEffect} from 'react'
import "./index.css";
import axios from 'axios';
import io from 'socket.io-client';
import {useNavigate } from "react-router-dom";
import InnerChat from './InnerChat';

const Chat = ({dataUserEntered, ChatEntered, fetchUser, dataUserCurrent, isFetchingUser}) => {

  const socket = io.connect('http://localhost:3001/');

  const [loading, setloading] = useState(true);
  const [entered, setentered] = useState(null);
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
        entered === true?
        <div className='singleChat'>
          <InnerChat dataUserEntered={dataUserEntered} ChatEntered={ChatEntered}   fetchUser={fetchUser} dataUserCurrent={dataUserCurrent} isFetchingUser={isFetchingUser}   />
        </div>
        : entered === false &&
        <div className='singleChat singleChatsingleChat'>
          Oops, something went wrong!
          <br />
          <button
            onClick={()=>{
              nav(0);
            }}
            className='refreshPage'
          >
            Refresh Page
          </button>
        </div>
      }
      </div>
    }
    </>
  )
}

export default Chat