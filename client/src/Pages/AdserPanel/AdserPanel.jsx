import React, { useEffect, useState } from 'react'
import './index.css'
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';



const AdserPanel = ({dataUserCurrent, fetchCurrentUser }) => {


  const [planClicked, setPlanClicked] = useState(null);
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');
  const navigate = useNavigate();


  const handleSubmit = async(event)=>{
    event.preventDefault();
    if(planClicked !== null && token){
      try{

        const stripe = await loadStripe('pk_test_51P4dtbJ7Wuh8P9GANTiZYjKQCCHK5xKDozPeDD4iK22V7cXzvjOCSdI9eK0mvLRUxEDlMUz2EwTYib0Y8hbg6Twn00B7Z3GNEr');

    
        const resp = await axios.get(`http://localhost:3001/ads/choose-plan/${planClicked}/${token}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          const session = resp.data;
          const result = stripe.redirectToCheckout({
            sessionId : session.id
          });
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
            Plan 1 : 20$
          </button>
          <br />
          <button
            type="button"
            className={planClicked === 2 && "activatedPlan"}
            onClick={()=>{
              setPlanClicked(2);
            }}
          >
            Plan 2 : 30$
          </button>
          <br />
          <button
            type="button"
            className={planClicked === 3 && "activatedPlan"}
            onClick={()=>{
              setPlanClicked(3);
            }}
          >
            Plan 3 : 45$
          </button>
          <br /><br /><br />
          {
            planClicked !== null && 
            <span
            >
              You choosed plan {planClicked}, Submit it 
            </span>
          }
          {
            planClicked !== null && 
             
              <button
                type='submit'
              >
                Purchase Plan  
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