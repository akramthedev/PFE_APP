import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import './index.css';
import '../Home/Home.css';



const Profile = ({ dataUserCurrent, isFetchingUser }) => {


  const { id } = useParams();
  const token = localStorage.getItem('token');
  const idVisited = id;
  const currentId = dataUserCurrent?._id;

  const [loading, setLoading] = useState(true);
  const [visitedUser, setVisitedUser] = useState(null);

 

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (token && id) {
          const response = await axios.get(`http://localhost:3001/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setVisitedUser(response.data);
          } else {
            throw new Error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error(error);
        alert('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className='Home Profile'>
      <Navbar isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
      <div className="home2">
        <div className="h0">
          {
            loading ? "Loading..."
            :
            <>
            {
              visitedUser &&
              <>
              {
                visitedUser.fullName
              }
              </>
            }
            </>
          }
        </div>
        <div className="h3">
          <Ads />
          <BirthDays isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
          <Contacts isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
