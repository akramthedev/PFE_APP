import React, { useEffect, useState } from 'react'
import './index.css';
import axios from 'axios';

const InnerChat = ({ ChatEntered, fetchUser, dataUserCurrent, isFetchingUser}) => {



  const [User, setUser] = useState(null);
  const [loading, setloading] = useState(null);
  const [allMessages, setallMessages] = useState(null);
  const [RoomInformations, setRoomInformations] = useState(null);
  const [idUserVisited, setIDUserVisited] = useState(null);
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');


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
        setUser(null)
        console.log(e.message);
      } finally{
        setloading(false);
      }
    }
    x();
  }, [ChatEntered]);


  return (
    <div className='InnerChat'>
    {
      loading ? <span className="loadingxxx">
        Loading...
      </span>
      :
      <>
      <div className="parti1k">
            <div className="casek1">
            {
              loading ? 
              <img src="https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png" alt="" />
              :
              <img src={User ? User.profilePic : "https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png"} alt="" />
            }
            </div>
            <div className="case2k">
                <span>{User && User.fullName}</span>
                <span>{User &&  User.email}</span>
            </div>
        </div>
        <div className="parti2k">

        </div>
        <div className="parti3k">
            
        </div>
      </>
    } 
    </div>
  )
}

export default InnerChat