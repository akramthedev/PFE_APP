
import React, {useState, useEffect, useRef} from 'react'
import "./index.css";
import axios from 'axios';
import {useNavigate } from "react-router-dom";
import { useSocket } from '../../Helpers/SocketContext';
import DiscordNotificationSound from '../../MP3Sounds/discord-notification.mp3';
import MyMessage from './MyMessage';
import HisMessage from './HisMessage';
import ScrollToBottom from 'react-scroll-to-bottom';



const Chat = ({socket, ChatEntered}) => {


  const [loading, setloading] = useState(true);
  const [entered, setentered] = useState(true);
  const [allMessages, setallMessages] = useState(null);
  const [User, setUser] = useState(null);
  const [RoomInformations, setRoomInformations] = useState(null);
  const [idUserVisited, setIDUserVisited] = useState(null);
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');
  const [message, setmessage] = useState('');
  const messagesEndRef =  useRef(null);
  const {receivedMsg} = useSocket();

  const audioNotification = new Audio(DiscordNotificationSound);

  const playAudioNotificationDISCORD = ()=>{
    audioNotification.play();
  }


  const nav = useNavigate();

  
  const EnterConversation = ()=>{
      if(ChatEntered){
        let data = {
          idRoom : ChatEntered, 
          idWhoEnter : idUser
        }
        socket.emit("EnterConvWithFriend", data);
      }
  }


  useEffect(()=>{
    EnterConversation();
  }, [ChatEntered]);


  useEffect(()=>{
    const x = async()=>{
      try{

        setloading(true);
        setallMessages(null);
        setRoomInformations(null);
        setIDUserVisited(null);

        const resp = await axios.get(`http://localhost:3001/room/getmessages/${ChatEntered}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status ===200){
          setallMessages(resp.data);
        }
        else{
          setallMessages([]);
        }

        const resp2 = await axios.get(`http://localhost:3001/room/${ChatEntered}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp2.status === 200){
          setRoomInformations(resp2.data);
          
          let userVisitedId;

          if(resp2.data.member1 === idUser){
            userVisitedId = resp2.data.member2;
            setIDUserVisited(resp2.data.member2);
          }
          else{
            userVisitedId = resp2.data.member1;
            setIDUserVisited(resp2.data.member1);
          }

          const resp3 = await axios.get(`http://localhost:3001/user/${userVisitedId}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp3.status ===200){
            setUser(resp3.data);
            
          }
          else{
            setUser(null)
          }

        }
        else{
          setRoomInformations(null);
        }



      }
      catch(e){
        console.log(e.message);
      } finally{
        setloading(false);
      }
    }
    x();
  }, [ChatEntered]);





  

  useEffect(()=>{
    const x = ()=>{
      if(receivedMsg){
        if(receivedMsg.sentTo === idUser && ChatEntered === receivedMsg.roomId){
          if(allMessages!== null){
            setallMessages(prev=>[
              ...prev, 
              receivedMsg
            ]);
          }
          playAudioNotificationDISCORD();
        }
      }
    }
    x();
  }, [receivedMsg]);



  const SendMsg = async (event)=>{
    event.preventDefault();
    try{
      if(message !== "" && message !== " " && message !== "  " && User){
        //socket request 
        let data = {
          isSeen : false,
          senderId : idUser, 
          roomId : ChatEntered,
          message : message, 
          sentTo : User._id, 
          createdAt : new Date()
        }
        socket.emit("sendMessage", data);

        setallMessages(prev=>[
          ...prev, 
          data
        ]);

        setmessage("");

        //axios request 
        await axios.post(`http://localhost:3001/room/sendMsg`,data,{
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
      }
    }
    catch(e){
      console.log(e.message);
    }
  }


  useEffect(() => {
    socket.on('receiveMessage', (data) => {
        alert("Received a message...");
    });
    return () => {
      socket.off('receiveMessage');  
    };
  }, [socket]);


  return (
    <>
    { 
      (ChatEntered ) ? 
      <div className='chatEntered'>
      {
        (entered  && ChatEntered) ?
        <div className='singleChat'>
          {
            loading ?  
            <div className="noDataYet">
              Loading...
            </div>
            :
            <>
            <div className="parti1k">
                  <div
                    onClick={()=>{
                      if(User){
                        nav(`/profile/${User._id}`)
                      }
                    }}
                    className="casek1">
                  {
                    loading ? 
                    <img src="https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png" alt="" />
                    :
                    <img src={User ? User.profilePic : "https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png"} alt="" />
                  }
                  </div>
                  <div 
                    onClick={()=>{
                      if(User){
                        nav(`/profile/${User._id}`)
                      }
                    }}
                    className="case2k"
                  >
                      <span>{User && User.fullName}</span>
                      <span>{User &&  User.email}</span>
                  </div>
              </div>
              <ScrollToBottom className='parti2k'>
                  {
                    allMessages && 
                    <>
                    {
                      allMessages.length === 0 ? 
                      <div className="noDataYet">
                        No message yet
                      </div>
                      :
                      <>
                      {
                        allMessages.map((message, index)=>{
                          return(
                            <>
                            {
                              message.senderId === idUser ? 
                              <MyMessage message={message}/>
                              :
                              <HisMessage message={message}/>
                            }
                            </>
                          )
                        })
                      }
                      </>
                    }
                    </>
                  }
              </ScrollToBottom>
              <form onSubmit={SendMsg} className="parti3k">
                <input 
                  spellCheck={false}
                  value={message}
                  onChange={(e)=>{
                    setmessage(e.target.value)
                  }}
                  type="text" 
                  placeholder='Type your message...' 
                />
                <button
                  type='submit'
                >
                  <i className='fa-solid fa-paper-plane'></i>
                </button>
              </form>
            </>
          } 
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
      :
      <>
        No Room Was Joined ...
      </>  
  }
    </>
  )
}

export default Chat