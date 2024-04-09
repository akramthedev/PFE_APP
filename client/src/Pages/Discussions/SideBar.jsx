import React, {useState, useEffect} from 'react'
import './index.css';
import axios from 'axios';
import Room from './Room';





const SideBar = ({setdataUserEntered, enterChat, ChatEntered}) => {

    
  const idUser = localStorage.getItem('idUser')
  const token = localStorage.getItem('token')

  const [allRooms, setallRooms] = useState(null);
  const [loading, setloading] = useState(true);

    
  useEffect(()=>{
    const x = async()=>{
      try{
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
      catch(e){
        setallRooms([])
        console.log(e.message);
      } finally{
        setTimeout(()=>{
          setloading(false)
        }, 1000);
      }
    }
    x();
  }, []);


  return (
    <div className='SideBar'>
        {
            loading ? 
            <>
              <div className="Discuscucucuc">
              Chatbox
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
                Chatbox
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
                      <Room setdataUserEntered={setdataUserEntered} ChatEntered={ChatEntered} num={id} enterChat={enterChat}  room={room} />
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