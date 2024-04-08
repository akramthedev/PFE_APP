import React, {useState, useEffect, useRef} from 'react'
import './index.css';
import Navbar from '../../Components/Navbar/Navbar';
import SingleRequest from '../../Components/SingleRequest/SingleRequest'
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";
import HttpRequestStatus from '../../Components/HttpRequestStatus/HttpRequestStatus';
import { useSocket } from '../../Helpers/SocketContext';
import useOutsideAlerter from '../../Helpers/HidePopUp';
import { TheOneWhoHasBirthDay } from '../Home/TheOneWhoHasBirthDay';


const Requests = ({isFetchingUser, dataUserCurrent, renderUserInfos}) => {

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const { socket } = useSocket();

    const [AllRequests,setAllRequests] = useState(null);
    const [isFetchingAllRequests,setIsFecthingAllRequests] = useState(true);


    
  const [isBClicked,setisBClicked] = useState(false);
  const [TheOnesWhoHaveBirthday,setTheOnesWhoHaveBirthday] = useState(null);
  const refref = useRef(null); 
  useOutsideAlerter(refref, setisBClicked);

    useEffect(()=>{

      const x = ()=>{
        window.scrollTo({
          top: 0,
          left: 0,
          behavior : "instant",
        });    
      }
      x();
  
  }, []);

  
    let ResponseRequest = {
      status : null,
      msg : null, 
    }
    
    const fetchUserRequests = async ()=>{
      if(idUser && token){
        try{
          const resp = await axios.get(`http://localhost:3001/request/user/${idUser}`);
          if(resp.status === 200){
            console.log(resp.data);
            setAllRequests(resp.data);
          }
          else{
            ResponseRequest = {
              status : 202,
              msg : "Oops, something went wrong!", 
            }
          }
        }
        catch(e){
          ResponseRequest = {
            status : 202,
            msg : "Oops, something went wrong with the server!", 
          }
          console.log(e.message);
        } finally{
          setIsFecthingAllRequests(false);
        }
      }
    }

    useEffect(()=>{
      fetchUserRequests();
    }, []);
 

    const handleRejectAllRequests = async ()=>{
      if(AllRequests && AllRequests.length !== 0){
        try {
          const resp =  await axios.delete(`http://localhost:3001/request/user/${idUser}`);
          if(resp){
            ResponseRequest = {
              status : resp.status, 
              msg : resp.data
            }
          }
        }
        catch(e){
          console.log(e.messgae);
        } finally{
          fetchUserRequests();
        }
      }
    }


  return (
    <div className='Home'>
      
          <div className={isBClicked ? "isBClicked showisBClicked" : "isBClicked"}>
          <div className="rowzodjq">
              Wish a Happy Birthday!
            </div>
            <div ref={refref} className={isBClicked ? "isContainerB showisContainerB" : "isContainerB"}>
            {
              TheOnesWhoHaveBirthday && 
              TheOnesWhoHaveBirthday.length !== 0 && 
              TheOnesWhoHaveBirthday.map((one, index)=>{
                return(
                  <TheOneWhoHasBirthDay  one={one} dataUserCurrent={dataUserCurrent} />
                )
              })
            }
            </div>
          </div>


        {
          (!isFetchingUser && dataUserCurrent && !isFetchingAllRequests) && 
          <HttpRequestStatus responseX={ResponseRequest} />
        }

          <Navbar socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <div className="jackiChan">
                Friend Requests
                <button
                  onClick={handleRejectAllRequests}
                  className={AllRequests ? (AllRequests.length !== 0 ? 'deleteAllNotif' : 'deleteAllNotif notAllowed') : "deleteAllNotif notAllowed"}  
                >
                  Reject All 
                </button>
              </div>
              {
                isFetchingAllRequests ? <span className='sdjoqc'>Loading ...</span>
                :
                <>
                {
                  AllRequests && 
                  <>
                  {
                    AllRequests.length === 0  ? <span className='sdjoqc'>No friend's request yet...</span>
                    :
                    AllRequests.map((request, index)=>{
                      return(
                        <SingleRequest  renderUserInfos={renderUserInfos}  reRenderParentComponent={fetchUserRequests} request={request} index={index} />
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
              <BirthDays  setisBClicked={setisBClicked} setTheOnesWhoHaveBirthday={setTheOnesWhoHaveBirthday } isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts   isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} socket={socket}  />
            </div>
          </div>
       
    </div>
  )
}

export default Requests