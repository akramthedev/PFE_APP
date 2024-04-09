import React, {useState, useEffect} from 'react'
import "./index.css";
import axios from 'axios';
import io from 'socket.io-client';
import {useNavigate } from "react-router-dom";

const socket = io.connect('http://localhost:3001/');

const Chat = ({dataUserEntered, ChatEntered, fetchUser, dataUserCurrent, isFetchingUser}) => {


  const [loading, setloading] = useState(true);
  const [entered, setentered] = useState(null);
  const [allMessages, setallMessages] = useState(null);
  const [User, setUser] = useState(null);
  const [RoomInformations, setRoomInformations] = useState(null);
  const [idUserVisited, setIDUserVisited] = useState(null);
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');
  const [message, setmessage] = useState('');



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
          setallMessages(null);
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





  




  const SendMsg = async (event)=>{
    event.preventDefault();
    try{
      if(message !== "" && message !== " " && message !== "  "){
        //socket request 
        let data = {
          senderId : idUser, 
          roomId : ChatEntered,
          message : message, 
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
         
        if (data.roomId === ChatEntered) {
          setallMessages(prev => [...prev, data]);
        }
    
    });
    return () => {
      socket.off('receiveMessage');  
    };
  }, [socket, ChatEntered]);

 


  return (
    <>
    { 
      (!isFetchingUser && dataUserCurrent && ChatEntered )&&
      <div className='chatEntered'>
      {
        (entered === true && ChatEntered) ?
        <div className='singleChat'>
          {
            loading ? <span className="loadingxxx">
              Loading...
            </span>
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
              <div className="parti2k">
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
                          message.message
                        }
                        <br />
                        </>
                      )
                    })
                  }
                  </>
                }
                </>
              }
              </div>
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
    }
    </>
  )
}

export default Chat