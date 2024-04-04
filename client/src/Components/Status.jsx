import React from 'react'; // Removed {useState} as it's not being used
import './index.css';
import {useNavigate} from 'react-router-dom';

const Status = ({ alreadyAccount, status, isEnabled }) => {
  
  const navigate= useNavigate();
  
  return (
    <div className={isEnabled ? "Status showStatus" : "Status"}>
      {isEnabled && (
        <>
          {alreadyAccount ? (
            status && (
              <>
                {status === 204  ? (
                  "No user was found with this email"  
                ) 
                  :status === 237 ? (
                    <span>You've been temporarily banned from the platform.&nbsp;&nbsp;&nbsp;<span onClick={()=>{navigate('/contact')}} className="contactUs">Contact Us</span></span>
                  )
                : status === 202 ? (
                    "Invalid credentials"
                ) 
                :
                status === 500 ? (
                  "Oops, server error." 
                ) : null}  
              </>
            )
          ) : (
            <>
              {status && (
                <>
                 {status === 201 ? (
                  "Email already taken."  
                ) : status === 202 ? (
                  "Oops, something went wrong.." 
                ) : 
                status === 500 ? (
                    "Oops, server error." 
                  ) : null
                } 
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Status;
