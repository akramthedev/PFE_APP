import React from 'react'
import './index.css';


const InnerChat = ({ ChatEntered, fetchUser, dataUserCurrent, isFetchingUser, dataUserEntered}) => {
  return (
    <div className='InnerChat'>
        <div className="parti1k">
            <div className="casek1">
                <img src={dataUserEntered.profilePic} alt="" />
            </div>
            <div className="case2k">
                <span>{dataUserEntered.fullName}</span>
                <span>{dataUserEntered.email}</span>
            </div>
        </div>
        <div className="parti2k">
        
        </div>
        <div className="parti3k">
            
        </div> 
    </div>
  )
}

export default InnerChat