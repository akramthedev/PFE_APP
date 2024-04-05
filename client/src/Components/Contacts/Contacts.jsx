import React from 'react'
import './Contacts.css';
import SingleContact from './SingleContact.jsx';

const Contacts = ({socket}) => {

  const contact = null;
  
  return (
    <div className='Contacts'>
        <div className="sponsored">
          Contacts <span className='qduov'>(4)</span>
        </div>
        <div className="AllContact">
          <SingleContact socket={socket} contact={contact} />
        </div>
    </div>
  )
}

export default Contacts