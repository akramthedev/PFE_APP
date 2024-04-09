import React, {useState, useEffect} from 'react'
import "./index.css";
import axios from 'axios';
import io from 'socket.io-client';
import {useNavigate, useParams } from "react-router-dom";

const Chat = ({dataUserCurrent, isFetchingUser}) => {

  const socket = io.connect('http://localhost:3001/');

  const [loading, setloading] = useState(true);
  const [entered, setentered] = useState(false);
  const token = localStorage.getItem('token')
  const idUser = localStorage.getItem('idUser');
  const nav = useNavigate();
  const {id} = useParams();

  
  const EnterConversation = ()=>{
    if(id){
      let data = {
        idRoom : id, 
        idWhoEnter : idUser
      }
      socket.emit("EnterConvWithFriend", data);
    }
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
      !isFetchingUser && dataUserCurrent && 
      <>
      {
        entered && 
        <div className='singleChat'>
          Welcome to Room : {id}
        </div>
      }
      </>
    }
    </>
  )
}

export default Chat