import React, {useState, useEffect} from 'react'
import "./index.css";
import axios from 'axios';
import {useNavigate } from "react-router-dom";


const Room = ({socket,setdataUserEntered, ChatEntered, num, room, enterChat}) => {


    const [user, setUser] = useState(null);
    const [loading, setloading] = useState(true);
    const token = localStorage.getItem('token')
    const idUser = localStorage.getItem('idUser')
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
          setdataUserEntered(resp.data);
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
    <>
    {
        !user && loading ? 
        <button className={`SingleChatX SingleChatXSkelton SingleChatXSkelton${num%2 ? "2" : "1"}`}>

        </button>
        :
        <button
            className={(ChatEntered && (ChatEntered === room._id ))? "SingleChatX actiavtedSingleChatX" : "SingleChatX"}
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
    </>
  )
}

export default Room