import React from 'react'
import './index.css'
import formatCreatedAtToMinHours from '../../Helpers/GetTime';


const HisMessage = ({message}) => {
  return (
    <div className='rowMessageHis'>
      <div className="hisMsg">
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

export default HisMessage