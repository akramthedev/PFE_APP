import React, {useState, useEffect} from 'react'
import './index.css';
import axios from 'axios';
import HttpRequestStatus from '../HttpRequestStatus/HttpRequestStatus';

const SingleNotification = ({notif, index, reRenderParentComponent}) => {

    let ResponseRequest = {
      status : null, 
      msg : null
    }

    const handleDeleteNotif = async()=>{
      try{
        const resp = await axios.delete(`http://localhost:3001/notif/${notif._id}`);
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
        setTimeout(()=>{
          reRenderParentComponent();
        }, 1000);
      }
    }


    return (
      <>
       
      {
        notif && 
        <>
        <HttpRequestStatus responseX={ResponseRequest}/>
        {
          notif.type === "Welcoming" ? 
          <div key={index} className='SingleNotification'>
            <button
              onClick={()=>{
                handleDeleteNotif();
              }}
              className='deleteSingleNotif'
            >
              <i className='fa-solid fa-trash'></i>
            </button>
            <div className="rowTitleNotif rowTitleNotif2">
              {
                notif.title
              }
            </div>
            <br />
            {
              notif.description1 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description1
              }
            </div>
            }
            {
              notif.description2 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description2
              }
            </div>
            }
            {
              notif.description3 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description3
              }
            </div>
            }
            {
              notif.description4 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description4
              }
            </div>
            }
            {
              notif.description5 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description5
              }
            </div>
            }
            <div className="rowTitleNotif rowImgCompany">
              <img src="https://res.cloudinary.com/dqprleeyt/image/upload/v1712318887/and_parkle___3_-removebg-preview_lyfila.png" alt="" />
            </div>
          </div>
          :
          <div key={index} className='SingleNotification'>
            
          </div>
        }
        </>
      }
      </>
  )
}

export default SingleNotification