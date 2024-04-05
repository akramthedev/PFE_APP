import React from 'react'
import "./Contacts.css";
import {useNavigate} from 'react-router-dom';


const SingleContact = () => {

  const navigate = useNavigate();

  return (
        <div className="rowContact"
          onClick={()=>{
            navigate("/profile/666");
          }}
        >
            <div className="containerImg">
              <img 
                src="https://deadline.com/wp-content/uploads/2022/05/Jonathan-Ma.png?w=1024"
                alt=""
              />
              <div className="bulleConnectionStatus">

              </div>
            </div>
            <span>
              Joma Ma 
            </span>
        </div>
    )
}

export default SingleContact