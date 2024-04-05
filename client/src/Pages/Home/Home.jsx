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



const Home = ({socket}) => {

  
  return (
    <div className='Home'>
      <Navbar socket={socket} />
      <div className="home2">
        <div className="h1">
          <UtilsAndNavigations socket={socket} />
        </div>
        <div className="h2">
          <CreatePost />
          <Post />
          <PostAds /> 
        </div>
        <div className="h3">
          <Ads />
          <BirthDays />
          <Contacts socket={socket}  />
        </div>
      </div>
    </div>
  )
}

export default Home