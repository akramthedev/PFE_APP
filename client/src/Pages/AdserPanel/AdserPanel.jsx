import React, { useEffect, useState } from 'react'
import './index.css'
import axios from "axios";
import {useNavigate} from 'react-router-dom';


const AdserPanel = ({dataUserCurrent, fetchCurrentUser }) => {


  const [planClicked, setPlanClicked] = useState(null);
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');
  const navigate = useNavigate();


  const handleSubmit = async(event)=>{
    event.preventDefault();
    if(planClicked !== null){
      try{
        const resp = await axios.get(`http://localhost:3001/ads/choose-plan/${planClicked}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          navigate(`/adser/panel/plan/${token}`);
        }
        else{
          navigate(0);
        }
      }
      catch(e){ 
        console.log(e.message);
      }
    }
  }

  useEffect(()=>{
    const x = ()=>{
      if(dataUserCurrent && (dataUserCurrent.role === "adser" && (dataUserCurrent.plan === 1 || dataUserCurrent.plan===2 || dataUserCurrent.plan === 3))){
        navigate(`/adser/panel/plan/${token}`);
      }
      else{

      }
    }
    x();
  }, [dataUserCurrent]);


  return (
    <>
    {
      dataUserCurrent
      && 
      <>
      {
        (dataUserCurrent.plan !== 1 || dataUserCurrent.plan !== 2 || dataUserCurrent.plan !== 3) ? 
        <form onSubmit={handleSubmit} className='plans'>
          Please Choose a plan
          <br /><br />
          <button
            type="button"
            className={planClicked === 1 && "activatedPlan"}
            onClick={()=>{
              setPlanClicked(1);
            }}
          >
            Plan 1 (view paper for more details)
          </button>
          <br />
          <button
            type="button"
            className={planClicked === 2 && "activatedPlan"}
            onClick={()=>{
              setPlanClicked(2);
            }}
          >
            Plan 2 (view paper for more details)
          </button>
          <br />
          <button
            type="button"
            className={planClicked === 3 && "activatedPlan"}
            onClick={()=>{
              setPlanClicked(3);
            }}
          >
            Plan 3 (view paper for more details)
          </button>
          <br /><br /><br />
          {
            planClicked !== null && 
            <button
             type='submit'
            >
              You choosed plan {planClicked}, Submit it 
            </button>
          }
        </form>
        :
        <>
          You Already Have a plan 
        </>
      }
      </>
    }
    </>
  )
}

export default AdserPanel