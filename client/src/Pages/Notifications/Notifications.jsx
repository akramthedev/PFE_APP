import React, {useState, useEffect} from 'react'
import './index.css';
import Navbar from '../../Components/Navbar/Navbar';
import SingleNotification from '../../Components/SingleNotification/SingleNotification'
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";


const Notifications = ({socket ,isFetchingUser, dataUserCurrent}) => {

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    
    const [AllNotifications,setAllNotifications] = useState(null);
    const [isFetchingAllNotifs,setIsFecthingAllNotif] = useState(true);

    
    const fetchUserNotifications = async ()=>{
      if(idUser && token){
        try{
          const resp = await axios.get(`http://localhost:3001/notif/user/${idUser}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            console.log(resp.data);
            setAllNotifications(resp.data);
          }
          else{
            alert('Error 202');
          }
        }
        catch(e){
          alert('500 | Error Server');
          console.log(e.message);
        } finally{
          setIsFecthingAllNotif(false);
        }
      }
    }

    useEffect(()=>{
      fetchUserNotifications();
    }, []);


  return (
    <div className='Home'>
      
          <Navbar socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <div className="jackiChan">
                Your notifications
              </div>
              {
                isFetchingAllNotifs ? "Loading ..."
                :
                <>
                {
                  AllNotifications && 
                  <>
                  {
                    AllNotifications.length === 0  ? "No notification yet..."
                    :
                    AllNotifications.map((notif, index)=>{
                      return(
                        <SingleNotification notif={notif} index={index} />
                      )
                    })
                  }
                  </>
                }
                </>
              }
            </div>
            <div className="h3">
              <Ads />
              <BirthDays  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts   isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} socket={socket}  />
            </div>
          </div>
       
    </div>
  )
}

export default Notifications