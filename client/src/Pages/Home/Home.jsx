import React, {useState, useEffect} from 'react'
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';
import CreatePost from '../../Components/CreatePost/CreatePost';
import Post from '../../Components/Post/Post';
import PostAds from '../../Components/Post/PostAds';
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";
import HttpRequestStatus from '../../Components/HttpRequestStatus/HttpRequestStatus';

const Home = ({ isFetchingUser, dataUserCurrent, ResponseRequest}) => {

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
     

  return (
    <div className='Home'>
      
        

          <Navbar  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <CreatePost  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Post  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <PostAds /> 
            </div>
            <div className="h3">
              <Ads />
              <BirthDays  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts    isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}   />
            </div>
          </div>
       
    </div>
  )
}

export default Home