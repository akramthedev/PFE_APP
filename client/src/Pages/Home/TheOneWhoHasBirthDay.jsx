import React, {useState} from 'react'
import "../../Components/BirthDays/BirthDays.css";
import axios from 'axios';


export const TheOneWhoHasBirthDay = ({one, dataUserCurrent}) => {
  

    const [isSent, setIsSent] = useState(false);


    const sendNotif = async()=>{
        try{
            await axios.post('http://localhost:3001/notif/wishBirthday',{
                wisher : dataUserCurrent.fullName,
                wishTo : one._id
            });
        }
        catch(e){
            console.log(e.message);
        }
    }


    return (

    <div className='fowTOWHB'
        onClick={()=>{
            setIsSent(true);
            if(!isSent){
                sendNotif();
            }
        }}
    >
        <img src={one.profilePic} alt="" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{one.fullName}
        <button className="wishHimHappyBirthday">
        {
            !isSent ? "Send Birthday Wishes 🥳"
            :
            <>
            Sent&nbsp;&nbsp;<i className='fa-solid fa-check'></i>
            </>
        }
        </button>
    </div>
    
  )
}
