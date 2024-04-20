import React from 'react'
import "./Auth.css";
import { Link } from 'react-router-dom'

const AccountBlocked = () => {
  return (
    <div className="AccountBlocked" >
        
        <h1>
            Your Account Has Been Suspended.
        </h1>
        <span>
            If you have questions or believe this to be a mistake, please contact us 
            &nbsp;<Link  className='zhiqd' to="/contact" >Here</Link>
        </span>
    </div>
  )
}

export default AccountBlocked