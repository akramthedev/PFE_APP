import React from 'react';
import "./BirthDays.css";
import Gift from '../../Assets/giftbox.png';
import {useNavigate} from 'react-router-dom';


const BirthDays = () => {
 

  return (
    <div className='Birthdays'>
        <div className="sponsored">
            Birthdays
        </div>
        <div className="rowAds">
            <img 
                src={Gift} 
                alt="GiftsBaby"
            />
            <span className="jackijack">
                <span>Joma Ma and 2 Others</span>
                <span>have their birthday today</span>
            </span>
        </div>
    </div>
    )
}

export default BirthDays