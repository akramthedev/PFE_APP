import React, {useState, useEffect} from 'react'
import './index.css';
import Navbar from '../../Components/Navbar/Navbar';
import SingleNotification from '../../Components/SingleNotification/SingleNotification'
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";
import HttpRequestStatus from '../../Components/HttpRequestStatus/HttpRequestStatus';


const Notifications = ({socket ,isFetchingUser, dataUserCurrent}) => {

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    
    const [AllNotifications,setAllNotifications] = useState(null);
    const [isFetchingAllNotifs,setIsFecthingAllNotif] = useState(true);
    
    let ResponseRequest = {
      status : null,
      msg : null, 
    }
    
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
 

    const handleDeleteAllNotifs = async ()=>{
      if(AllNotifications && AllNotifications.length !== 0){
        try {
          const resp = await axios.delete(`http://localhost:3001/notif/user/${idUser}`);
          if(resp){
            ResponseRequest = {
              status : resp.status, 
              msg : resp.data
            }
          }
        }
        catch(e){
          console.log(e.message);
          ResponseRequest = {
            status : 500, 
            msg : e.message
          }
        } finally{
          fetchUserNotifications();
        }
      }
    }


  return (
    <div className='Home'>
      
      

        {
          (!isFetchingUser && dataUserCurrent && !isFetchingAllNotifs) && 
          <HttpRequestStatus responseX={ResponseRequest} />
        }


          <Navbar socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <div className="jackiChan">
                Notifications 
                
                <button
                  onClick={handleDeleteAllNotifs}
                  className={AllNotifications ? (AllNotifications.length !== 0 ? 'deleteAllNotif' : 'deleteAllNotif notAllowed') : "deleteAllNotif notAllowed"}  
                >
                  Delete All 
                </button>
              </div>
              {
                isFetchingAllNotifs ? <span className='sdjoqc'>Loading ...</span>
                :
                <>
                {
                  AllNotifications && 
                  <>
                  {
                    AllNotifications.length === 0  ? <span className='sdjoqc'>No notification yet...</span>
                    :
                    AllNotifications.map((notif, index)=>{
                      return(
                        <SingleNotification reRenderParentComponent={fetchUserNotifications} notif={notif} index={index} />
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