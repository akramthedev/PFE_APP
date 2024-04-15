import React, { useEffect, useState } from 'react'
import './index.css'
import axios from "axios";
import {useNavigate, useParams} from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import SpinSvg from '../../Assets/spinwhite.svg'


const UpgradeYourPlan = ({dataUserCurrent, fetchCurrentUser }) => {


    const [planClicked, setPlanClicked] = useState(null);
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const navigate = useNavigate();
    const {plan} = useParams();
    const planInNumbers = parseInt(plan);




    const handleSubmit = async(event)=>{
        event.preventDefault();
        if(planClicked !== null && token){
        try{

            const stripe = await loadStripe('pk_test_51P4dtbJ7Wuh8P9GANTiZYjKQCCHK5xKDozPeDD4iK22V7cXzvjOCSdI9eK0mvLRUxEDlMUz2EwTYib0Y8hbg6Twn00B7Z3GNEr');

        
            const resp = await axios.get(`http://localhost:3001/ads/upgrade-plan/${planClicked}/${token}`, {
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

   


  return (
    <>
    {
      dataUserCurrent ?
      <div className='allPlans'>

        <button
        className='backHome'
          onClick={()=>{
            navigate('/');
          }}
        >
          Back Home
        </button>
      
      {
        (dataUserCurrent.plan !== 1 || dataUserCurrent.plan !== 2 || dataUserCurrent.plan !== 3) ? 
        <form onSubmit={handleSubmit} className='plans'>
          <div className="containeruoqedf">
            <h1>
              Choose a plan
            </h1>
          {
            planClicked !== null && 
             
              <button
              className='purchasePlan'
                type='submit'
              >
                Purchase Plan : {planClicked === 1 ? "Team":  planClicked === 2 ? "Agency" : "Entreprise"}&nbsp;&nbsp;&nbsp;&nbsp;<i className='fa-solid fa-arrow-right'></i>
              </button>
           
          }
          </div>
          <div className="containerOfAllPlans">
          

            {
                planInNumbers !== 2 && 
                <div className={planClicked && planClicked === 2  ? "cartI activated":"cartI"}>
                    <div className="rowzuqefd">
                        Agency
                    </div>
                    <div className="eqifcd">
                        $100
                    </div>
                    <div className="rowGetStarted">
                      <button
                        type="button"
                        className={planClicked === 2 && "activatedPlan"}
                        onClick={()=>{
                          if(planInNumbers !== 2){
                            setPlanClicked(2);
                          }
                        }}
                      >
                        {
                       planClicked !== 2 ? "Select it"
                       : <><i className='fa-solid fa-check'></i>&nbsp;&nbsp;Selected</>
                          }
                      </button>
                    </div>
                    <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Maximum Ads : 5
                    </div>
                    <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Highly Secure 
                    </div>
                    <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Help & Support 
                    </div>
                    <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Issues Fixing
                    </div>
                    <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Analytics Plateform
                    </div>
                </div>
            }
             
            
            <div className={planClicked && planClicked === 3  ? "cartI activated":"cartI"}>
              <div className="rowzuqefd">
                      Entreprise
                    </div>
                    <div className="eqifcd">
                      $299
                    </div>
                    
                      <div className="rowGetStarted">
                        <button
                            type="button"
                            className={planClicked === 3 && "activatedPlan"}
                            onClick={()=>{
                                setPlanClicked(3);
                            }}
                        >
                          {
                       planClicked !== 3 ? "Select it"
                       : <><i className='fa-solid fa-check'></i>&nbsp;&nbsp;Selected</>
                          }
                        </button>
                      </div>
                   
                      <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Maximum Ads : 5
                      </div>
                      <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Highly Secure 
                      </div>
                      <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Help & Support 
                      </div>
                      <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Issues Fixing
                      </div>
                      <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Analytics Plateform
                      </div>
                      <div className="zrjoqfe">
                      <i className='fa-solid fa-check'></i>&nbsp;&nbsp;Monetization Tracking
                      </div>
                  </div> 
              </div>
                        
          
          
        </form>
        :
        <>
          You Already Have a plan 
        </>
      }
      </div>
      :
      <div className="eqdhoqe">
        <span>
          <img src={SpinSvg} className='zueoqcd' alt="" />
          <span>
            Loading...
          </span>
        </span>
      </div>
    }
    </>
  )
}

export default UpgradeYourPlan