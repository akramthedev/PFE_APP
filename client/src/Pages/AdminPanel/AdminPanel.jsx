import React, {useState, useEffect} from 'react'
import "./index.css";
import Navbar from '../../Components/Navbar/Navbar';




const AdminPanel = ({isFetchingUser, dataUserCurrent, fetchCurrentUser}) => {



  return (
    <>
      <div className='AdminPanel'>  
        <Navbar isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
        AdminPanel      
      </div>
    </>
  )
}

export default AdminPanel