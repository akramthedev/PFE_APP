import React from 'react'
import './index.css';

const SingleNotification = ({notif, index}) => {
  
    return (
      <>
      {
        notif && 
        <>
        {
          notif.type === "Welcoming" ? 
          <div key={index} className='SingleNotification'>
            <div className="rowTitleNotif rowTitleNotif2">
              {
                notif.title
              }
            </div>
            <br />
            {
              notif.description1 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description1
              }
            </div>
            }
            {
              notif.description2 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description2
              }
            </div>
            }
            {
              notif.description3 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description3
              }
            </div>
            }
            {
              notif.description4 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description4
              }
            </div>
            }
            {
              notif.description5 !== '' && 
              <div className="rowTitleNotif">
              {
                notif.description5
              }
            </div>
            }
            <div className="rowTitleNotif rowImgCompany">
              <img src="https://res.cloudinary.com/dqprleeyt/image/upload/v1712318887/and_parkle___3_-removebg-preview_lyfila.png" alt="" />
            </div>
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