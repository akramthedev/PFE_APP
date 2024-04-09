import React, { useEffect, useState } from 'react'
import './index.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
 

const InnerChat = ({socket,allMessages, setallMessages ,ChatEntered, fetchUser, dataUserCurrent, isFetchingUser}) => {


 
  const [User, setUser] = useState(null);
  const [loading, setloading] = useState(null);
  const [RoomInformations, setRoomInformations] = useState(null);
  const [idUserVisited, setIDUserVisited] = useState(null);
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');
  const nav = useNavigate();
  const [message, setmessage] = useState('');

 



  

  




  return (
    <div className='InnerChat'>
    
    </div>
  )
}

export default InnerChat