import React, {useState, useEffect} from 'react';
import "./BirthDays.css";
import Gift from '../../Assets/giftbox.png';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';


const BirthDays = ({setTheOnesWhoHaveBirthday,isFetchingUser, dataUserCurrent, setisBClicked}) => {

    const [allUsersWhoHaveBirthDay, setAllContactsWhoHaveBirthday] = useState([]);
    const [loading, setloading] = useState(true);
    const currentuserId = localStorage.getItem('idUser');
    const token = localStorage.getItem('token');
    const location = useLocation();
    const {pathname} = location;


    useEffect(()=>{
        const x = async()=>{
            try{ 
                if (dataUserCurrent) {
                    if (dataUserCurrent.contacts.length !== 0) {
                        var currentDate = new Date();
                        var currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                        var currentDay = currentDate.getDate().toString().padStart(2, '0');
                        setAllContactsWhoHaveBirthday([]);
                        for (let i = 0; i < dataUserCurrent.contacts.length; i++) {
                            const resp = await axios.get(`http://localhost:3001/user/${dataUserCurrent.contacts[i]}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            if (resp.status === 200) {
                                if (resp.data.dateOfBirth && resp.data.dateOfBirth !== "") {
                                    const date = new Date(resp.data.dateOfBirth);
                                    const dayOfBirth = date.getDate().toString().padStart(2, '0');
                                    const monthOfBirth = (date.getMonth() + 1).toString().padStart(2, '0');
                                    if (dayOfBirth === currentDay && currentMonth === monthOfBirth) {
                                        setAllContactsWhoHaveBirthday(prev => [
                                            ...prev,
                                            resp.data
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
            }   
            catch(e){
                console.log(e.message);
            } finally{
                setloading(false);
            }
        }
        x();
    }, [pathname]);


  return (
    <>
    {
        !loading && 
        <>
        {
            allUsersWhoHaveBirthDay.length !== 0 && 
            <div className='Birthdays'
                onClick={()=>{
                    setisBClicked(true);
                    setTheOnesWhoHaveBirthday(allUsersWhoHaveBirthDay);
                }}
            >
                <div className="sponsored">
                    Birthdays
                </div>
                <div className="rowAds">
                    <img 
                        src={Gift} 
                        alt="GiftsBaby"
                    />
                    <span className="jackijack">
                    {
                        allUsersWhoHaveBirthDay.length === 1 ? 
                        <>
                        <span>{allUsersWhoHaveBirthDay[0].fullName}</span>
                        <span>have his birthday today!</span>
                        </>
                        :
                        <>
                        <span>{allUsersWhoHaveBirthDay[0].fullName} And {allUsersWhoHaveBirthDay.length-1} other {allUsersWhoHaveBirthDay.length === 2 ? "Contact":"Contacts"}</span>
                        <span>have their birthday today</span>
                        </>
                    }
                    </span>
                </div>
            </div>
        }
        </>
    }
    </>
    )
}

export default BirthDays