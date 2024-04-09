import React from 'react'
import './index.css'
import formatCreatedAtToMinHours from '../../Helpers/GetTime';


const MyMessage = ({message}) => {
  return (
    <div className='rowMessageHis rowMessageMine'>
      <div className="hisMsg Mymsg">
        {
          message && message.message
        }
        <div className="dateOfMsg">
          {
            formatCreatedAtToMinHours(message.createdAt)
          }
        </div>
      </div>
    </div>
  )
}

export default MyMessage