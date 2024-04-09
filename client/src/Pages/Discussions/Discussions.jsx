import React, {useState, useEffect} from 'react'
import './index.css';
import axios from 'axios';
import Room from './Room';


const Discussions = () => {

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
        setloading(false);
      }
    }
    x();
  }, []);


  return (
    <div
      className='Discussions'
    >
    {
      !allRooms && loading ? "Loading all conversations..."
      :
      <>
      {
        allRooms.length === 0 ? "No Conversation yet"
        :
        <>
        {
          allRooms.map((room, id)=>{
            return(
              <Room room={room} />
            )
          })
        }
        </>
      }
      </>
    }
    </div>
  )
}

export default Discussions