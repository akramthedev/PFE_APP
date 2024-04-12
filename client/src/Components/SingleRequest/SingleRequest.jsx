import React, {useState, useEffect} from 'react'
import './index.css';
import formatCreatedAt from '../../Helpers/GetTimeAndDate';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const SingleRequest = ({request, index, reRenderParentComponent, renderUserInfos}) => {

    const [dataUser, setDataUser] = useState(null);
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const navigate = useNavigate();


    useEffect(()=>{
      const x =  async ()=>{
         
        try{
          await axios.get(`http://localhost:3001/request/updateSeen/${request._id}`)
        }
        catch(e){
          console.log(e.message);
        }
        
      }
      x()
    }, []);

    const handleDeleteRequest = async()=>{
      try{
        await axios.delete(`http://localhost:3001/request/${request._id}`);
        reRenderParentComponent();
      }
      catch(e){
        console.log(e.message);
      } finally{
        reRenderParentComponent();
      }
    }

    const handleAcceptRequest = async()=>{
      if(request){
        try{
          await axios.post('http://localhost:3001/request/accept', {
              sender : request.sender, 
              sentTo : idUser, 
              type : "twoPeople"
          });
          renderUserInfos();
          reRenderParentComponent();
        }
        catch(e){
          console.log(e.message);
          reRenderParentComponent();
        }
      }
    }

    const getUserOfThisRequest = async()=>{
      if(request && token){
          try{
              const resp = await axios.get(`http://localhost:3001/user/${request.sender}`, {
                headers : {
                  Authorization : `Bearer ${token}`
                }
              });
              if(resp.status === 200){
                setDataUser(resp.data)
              }
              else{
                setDataUser(null);
              }
            }
            catch(e){
              console.log(e.message);
            }  
      }
    }

    useEffect(()=>{
      getUserOfThisRequest();
    }, []);


    return (
      <>
      {
         (request && dataUser) &&
         
          <div key={index} className='SingleNotification'>
            <div className="rowii">
            <div className="rowTitleNotif">
              <img onClick={()=>{
                navigate(`/profile/${dataUser._id}`)
              }} src={dataUser.profilePic} alt="" />
            </div>
            <span>{dataUser.fullName} has sent you a friend request. </span>
            </div>
              
              <div className=" rowii rowiirowii">
                <button onClick={()=>{
                handleAcceptRequest();
              }} className=' btnbtn accpt'>
                  Accept Request
                </button>
                <button onClick={()=>{
                handleDeleteRequest();
              }} className='btnbtn reject'>
                  Reject Request
                </button>
              </div>

              <span className="timeOuDate">
              {
                request && request.createdAt && 
                formatCreatedAt(request.createdAt)
              }
              </span>

          </div>
      }
      </>
  )
}

export default SingleRequest