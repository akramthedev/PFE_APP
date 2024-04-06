import React, { useEffect, useState } from 'react'
import './index.css';


const HttpRequestStatus = ({responseX}) => {
  
    const [response, setresponse] = useState(responseX);
    const [msg, setmsg] = useState(null);

    useEffect(()=>{
        
        if(response){
            if(response.status === 200){
                setmsg(response.msg);
            }
            else{
                setmsg(response.msg);
            }
        }

        if(response){
            setTimeout(()=>{
                setresponse(null);
            }, 2000);
            setTimeout(()=>{
                setmsg(null);
            }, 3000);
        }
    }, [responseX]);

    
  return (
    <div className={(response && response.status !== null ) ? "HttpRequestStatusPoPuP showHttpRequestStatusPoPuP" : "HttpRequestStatusPoPuP"}>
        <button
            className='closePopUp'
            onClick={()=>{
                setresponse(null);
                setTimeout(()=>{
                    setmsg(null);
                }, 1000);
            }}
        >
            <i className='fa-solid fa-xmark'></i>
        </button>
        {
            msg
        }
    </div>
  )
}

export default HttpRequestStatus