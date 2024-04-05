import React, {useState, useEffect} from 'react'
import "./Contacts.css";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


const SingleContact = ({socket, contact}) => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [dataContact, setdataContact] = useState(null);
    const [isOnline, setisOnline] = useState(false);


    const fetchUser = async ()=>{
      if(contact && token ){
        try{
          const resp = await axios.get(`http://localhost:3001/user/${contact}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            console.log(resp.data);
            setdataContact(resp.data);
          }
          else{
            alert('Error 202');
          }
        }
        catch(e){
          alert('500 | Error Server');
          console.log(e.message);
        } finally{
          setIsFetchingUser(false);
        }
      }
    }

    useEffect(()=>{
      fetchUser();
    }, []);



    useEffect(() => {
      if (contact) {
        
        const emitEvent = () => {
          socket.emit("CheckingOfConnectionStatus", contact);
        };

        emitEvent();

        const intervalId = setInterval(() => {
          emitEvent();
        }, 3000);
    
        return () => clearInterval(intervalId);
      }
    }, [contact]);


    useEffect(()=>{
      socket.on('ConnectionStatus', (data)=>{
        if(data ){
          if(data.idUser=== contact){
            if( data.status === "notOnline"){
              setisOnline(false);
            }
            else{
              setisOnline(true);
            }
          }
        }
      });
    }, [socket]);



  return (
        <div className="rowContact"
          onClick={()=>{
            if(contact ){
              navigate(`/profile/${contact}`)
            }
          }}
        >
            <div className="containerImg">
              {
                !isFetchingUser && dataContact && 
                <img 
                  src={dataContact.profilePic}
                  alt=""
                />
              }
              
              {
                isOnline ? <div className="bulleConnectionStatus" />
                :
                <div className="bulleConnectionStatus bulleConnectionStatusRED" />
              }
 
            </div>
            <span>
            {
              !isFetchingUser && dataContact && dataContact.fullName
            } 
            </span>
        </div>
    )
}

export default SingleContact