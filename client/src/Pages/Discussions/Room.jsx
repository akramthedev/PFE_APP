import React, {useState, useEffect} from 'react'
import "./index.css";
import axios from 'axios';
import {useSocket} from '../../Helpers/SocketContext';
import {useNavigate } from "react-router-dom";


const Room = ({room, enterChat}) => {


    const [user, setUser] = useState(null);
    const [loading, setloading] = useState(true);
    const token = localStorage.getItem('token')
    const idUser = localStorage.getItem('idUser')
    const socket = useSocket();
    const nav = useNavigate();

  useEffect(()=>{
    const x = async()=>{
      try{
        setloading(true);
        let idFriend = null;
        if(room.member1 === idUser){
            idFriend = room.member2;
        }
        else{
            idFriend = room.member1;
        }
        const resp = await axios.get(`http://localhost:3001/user/${idFriend}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status ===200){
          setUser(resp.data);
        }
        else{
          setUser(null)
        }
      }
      catch(e){
        setUser(null)
        console.log(e.message);
      } finally{
        setloading(false);
      }
    }
    x();
  }, []);


  return (
    <div>
    {
        !user && loading ? "Loading ..."
        :
        <button
            onClick={
              ()=>{
                enterChat(room._id);
              }
            }
        >
        {
          user && user.fullName
        }
        </button>
    }
    </div>
  )
}

export default Room