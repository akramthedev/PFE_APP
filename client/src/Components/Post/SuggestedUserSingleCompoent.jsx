import React, { useState } from 'react'
import "./Post.css";
import axios from 'axios';



const SuggestedUserSingleCompoent = ({user, index}) => {

  const [isClick, setIsClick] =  useState(false);
  const idUser = localStorage.getItem('idUser');
  
  
  const handleAddContact = async (id)=>{
    if(isClick === false){
      setIsClick(true);
      try{  
          await axios.post('http://localhost:3001/request/create', {
            sender : idUser, 
            sentTo : user._id, 
            type : "twoPeople"
          });
           
      }
      catch(e){
        console.log(e.message);
      }
    }
  }

  
  return (
    <>
    {
        user && 
        <div key={index} className='suggestedUserCompoent' > 
          <div className="rowImg">
            <img src={user.profilePic} alt="" />
          </div>
          <div className="rowFullNaMe">
          {
            user.fullName
          }
          </div>
          <div className="addCotAcT">
            <button
              onClick={()=>{
                handleAddContact(user._id)
              }}
              className={isClick && "invitationsent"}
            >
            {
              isClick ? "Invitation sent"
              :
              "Add Contact"
            }
            </button>
          </div>
        </div>
    }
    </>
  )
}

export default SuggestedUserSingleCompoent