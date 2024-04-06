import React, {useState, useEffect} from 'react'
import './index.css';
import axios from 'axios';


const SingleRequest = ({request, index, reRenderParentComponent}) => {



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


    return (
      <>
      {
        request && 
        <div key={index} className='SingleNotification'>
            <button
              onClick={()=>{
                handleDeleteRequest();
              }}
              className='deleteSingleNotif'
            >
              <i className='fa-solid fa-trash'></i>
            </button>
            <div className="rowTitleNotif rowTitleNotif2">
              {
              }
            </div>
          </div>
      }
      </>
  )
}

export default SingleRequest