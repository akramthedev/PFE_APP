import React, {useState, useEffect} from 'react'
import './index.css';
import axios from 'axios';
import Room from './Room';





const SideBar = ({render,socket,setdataUserEntered,dataUserCurrent,isFetchingUser, enterChat, ChatEntered}) => {

    
  const idUser = localStorage.getItem('idUser')
  const token = localStorage.getItem('token')

  const [allRooms, setallRooms] = useState(null);
  const [loading, setloading] = useState(true);

 

    
  useEffect(()=>{
    const x = async()=>{
      try{
        if(loading === false){
          const resp = await axios.get(`http://localhost:3001/room/allRoomsPerUser/${idUser}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status ===200){
            setallRooms(resp.data);
          }
          else{
            setallRooms([])
          }
        }
        else{
          setloading(true);
          const resp = await axios.get(`http://localhost:3001/room/allRoomsPerUser/${idUser}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status ===200){
            setallRooms(resp.data);
          }
          else{
            setallRooms([])
          }
        }
      }
      catch(e){
        setallRooms([])
        console.log(e.message);
      } finally{
        setloading(false)
      }
    }
    x();
  }, [render]);


  return (
    <div className='SideBar'>
        {
            loading ? 
            <>
              <div className="Discuscucucuc">
              Discussions
              </div>
              <div className="SingleChatXSkelton" />
              <div className="SingleChatXSkelton SingleChatXSkelton11" />
              <div className="SingleChatXSkelton SingleChatXSkelton0" />   
              <div className="SingleChatXSkelton SingleChatXSkelton1" />
              <div className="SingleChatXSkelton SingleChatXSkelton2" />  
              <div className="SingleChatXSkelton SingleChatXSkelton3" />
              <div className="SingleChatXSkelton SingleChatXSkelton4" />            
            </>
            :
            <>
            <div className="Discuscucucuc">
                Discussions
              </div>
            {
              allRooms &&
              <>
              {
                  allRooms.length === 0 ? "No Conversation yet"
                  :
                  <>
                  {
                  allRooms.map((room, id)=>{
                      return(
                      <Room allRooms={allRooms} socket={socket} setdataUserEntered={setdataUserEntered} ChatEntered={ChatEntered} num={id} enterChat={enterChat}  room={room} />
                      )
                  })
                  }
                  </>
              }
              </>
            }
            </>
            }
    </div>
  )
}

export default SideBar