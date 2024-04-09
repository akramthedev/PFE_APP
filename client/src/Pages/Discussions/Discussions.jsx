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


  const enterChat = (roomId)=>{
    setChatEntered(roomId);
  }


  return (
    <div className='Discussions'> 
      <SideBar enterChat={enterChat} />
    {
      ChatEntered ? 
      <Chat ChatEntered={ChatEntered} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchUser={fetchUser}  />
      :
      <div className="ChatProvisoire">
        <img src="" alt="" />
      </div>
    }
    </div>
  )
}

export default Discussions