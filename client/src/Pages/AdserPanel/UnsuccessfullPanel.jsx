import React from 'react'
import './index.css';
import {useNavigate} from 'react-router-dom';



const UnsuccessfullPanel = () => {

  const nav = useNavigate();


  return (
    <div  
      onClick={()=>{
        nav('/');
      }}
    className='pageUnsuccess'>
      <span
       onClick={()=>{
        nav('/');
      }}
      >Oops, something went wrong!</span>
      <button
       onClick={()=>{
        nav('/');
      }}
      >Back Home</button>
    </div>
  )
}

export default UnsuccessfullPanel