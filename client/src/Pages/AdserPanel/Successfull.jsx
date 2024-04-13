import React from 'react'
import './index.css';
import {useNavigate} from 'react-router-dom';



const Successfull = () => {

  const nav = useNavigate();
 
  return (
    <div  
    onClick={()=>{
      nav(`/adser/panel`);
      nav(0);
    }}
    className='pageUnsuccess pageSucess'>
      <span
       onClick={()=>{
        nav(`/adser/panel`);
        nav(0);
      }}
      >Your payement was successfull!</span>
      <button
       onClick={()=>{
        nav(`/adser/panel`);
        nav(0);
      }}
      >Visit Dashboard</button>
    </div>
  )
}

export default Successfull