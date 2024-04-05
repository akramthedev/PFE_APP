import React from 'react'
import './Contacts.css';
import SingleContact from './SingleContact.jsx';

const Contacts = ({socket, isFetchingUser, dataUserCurrent}) => {

  
  return (
    <div className='Contacts'>
        <div className="sponsored">
          Contacts <span className='qduov'>
            {
              dataUserCurrent && !isFetchingUser && 
              <>
                (
                  <>{dataUserCurrent.contacts.length}</>
                )
              </>
            }
          </span>
        </div>
        <div className="AllContact">
        {
          dataUserCurrent && !isFetchingUser && 
          <>
          {
            dataUserCurrent.contacts.length !== 0 ?
            <>
            {
              dataUserCurrent.contacts.map((contact)=>{
                return(
                  <SingleContact contact={contact} socket={socket} />
                )
              })
            }
            </>
            :
            <span className='qdjic'>
              No contact yet
            </span>
          }
          </>
        }
        </div>
    </div>
  )
}

export default Contacts