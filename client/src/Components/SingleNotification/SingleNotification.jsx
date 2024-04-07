import React, {useState, useEffect} from 'react'
import './index.css';
import formatCreatedAt from '../../Helpers/GetTimeAndDate';
import axios from 'axios';
import HttpRequestStatus from '../HttpRequestStatus/HttpRequestStatus';
import {useNavigate} from 'react-router-dom';



const SingleNotification = ({notif, index, reRenderParentComponent}) => {


    const navigate = useNavigate();

    let ResponseRequest = {
      status : null, 
      msg : null
    }

    const [isseen, setisseen] = useState(notif.seen);
    const [isHovered, setIsHovered] = useState(false);
    const idUser = localStorage.getItem('idUser');
 

    useEffect(()=>{
      const x =  ()=>{
        setTimeout(async ()=>{
          setisseen(true);
          await axios.get(`http://localhost:3001/notif/updateSeen/${notif._id}`)
        }, 1000);
      }
      x()
    }, []);

    const handleDeleteNotif = async()=>{
      try{
        const resp = await axios.delete(`http://localhost:3001/notif/${notif._id}`);
        if(resp){
          ResponseRequest = {
            status : resp.status, 
            msg : resp.data
          }
        }
      }
      catch(e){
        console.log(e.message);
        ResponseRequest = {
          status : 500, 
          msg : e.message
        }
      } finally{
        setTimeout(()=>{
          reRenderParentComponent();
        }, 1000);
      }
    }


    const postVisitedAxiosReq = async()=>{
      try{
        await axios.get(`http://localhost:3001/notif/visitedClicked/${notif._id}`);
      }
      catch(e){
        console.log(e.message);
      }
    }



    return (
      <>
       
      {
        notif && 
        <>
        <HttpRequestStatus responseX={ResponseRequest}/>
        {
          notif.type === "Welcoming" ? 
          <div 
            onMouseEnter={()=>{
              setIsHovered(true);
            }}
            key={index}
            onMouseLeave={()=>{
              setIsHovered(false);
            }}
            className='SingleNotification'
          >
            {
              isHovered && 
              <button
              onClick={()=>{
                handleDeleteNotif();
              }}
              className='deleteSingleNotif'
            >
              <i className='fa-solid fa-trash'></i>
            </button>
            }
            <div className="content content2">
              {
                notif.title
              }
            </div>
            <br />
            {
              notif.description1 !== '' && 
              <div className="content">
              {
                notif.description1
              }
            </div>
            }
            {
              notif.description2 !== '' && 
              <div className="content">
              {
                notif.description2
              }
            </div>
            }
            {
              notif.description3 !== '' && 
              <div className="content">
              {
                notif.description3
              }
            </div>
            }
            {
              notif.description4 !== '' && 
              <div className="content">
              {
                notif.description4
              }
            </div>
            }
            {
              notif.description5 !== '' && 
              <div className="content">
              {
                notif.description5
              }
            </div>
            }
            <div className="content contentImg">
              <img src="https://res.cloudinary.com/dqprleeyt/image/upload/v1712318887/and_parkle___3_-removebg-preview_lyfila.png" alt="" />
            </div>
          </div>
          : notif.type === "Friend Accepted" ? 
            <div 
              onMouseEnter={()=>{
                setIsHovered(true);
              }}
              key={index}
              onMouseLeave={()=>{
                setIsHovered(false);
              }}
              className=' SingleNotification3'
            >
                {
                    isHovered && 
                    <button
                    onClick={()=>{
                      handleDeleteNotif();
                    }}
                    className={isHovered ? "deleteSingleNotif showdeleteSingleNotif":  "deleteSingleNotif"}
                  >
                    <i className='fa-solid fa-trash'></i>
                  </button>
                  }
                <div className="content">
                  {
                    notif.title
                  }
                </div>
                <div className="content">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                  notif.description1
                }
                </div>
              <span className={isseen ? " isnotseen isseen" : "isnotseen"}>
                 <i className='fa-solid fa-check-double'></i>
              </span>
              <span className="timeOuDate">
              {
                notif && notif.createdAt && 
                formatCreatedAt(notif.createdAt)
              }
              </span>
            </div>
          : notif.type === "Post Created"? 
          <div 
              onMouseEnter={()=>{
                setIsHovered(true);
              }}
              key={index}
              onMouseLeave={()=>{
                setIsHovered(false);
              }}
              className=' SingleNotification3'
            >
                {
                    isHovered && 
                    <button
                    onClick={()=>{
                      handleDeleteNotif();
                    }}
                    className={isHovered ? "deleteSingleNotif showdeleteSingleNotif":  "deleteSingleNotif"}
                  >
                    <i className='fa-solid fa-trash'></i>
                  </button>
                  }
                <div className="content">
                  {
                    notif.title
                  }
                </div>
                <div className="content">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                  notif.description1
                }
                </div>
                <div className="content content2">
                {
                  !notif.isPostClicked &&
                  <button
                    className='visitPost'
                    onClick={()=>{
                      postVisitedAxiosReq();
                      navigate(`/profile/${idUser}`);
                    }}
                  >
                    View Post
                  </button>
                }
                </div>
              <span className={isseen ? " isnotseen isseen" : "isnotseen"}>
                 <i className='fa-solid fa-check-double'></i>
              </span>
              <span className="timeOuDate">
              {
                notif && notif.createdAt && 
                formatCreatedAt(notif.createdAt)
              }
              </span>
            </div>
          :
          <div key={index} className='SingleNotification'>
            
          </div>
        }
        </>
      }
      </>
  )
}

export default SingleNotification