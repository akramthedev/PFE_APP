import React, {useState, useEffect} from 'react'
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';
import CreatePost from '../../Components/CreatePost/CreatePost';
import Post from '../../Components/Post/Post';
import PostAds from '../../Components/Post/PostAds';
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';


const Home = () => {


  return (
    <div className='Home'>
      <Navbar />
      <div className="home2">
        <div className="h1">

        </div>
        <div className="h2">
          <CreatePost />
          <Post /><PostAds /> 
        </div>
        <div className="h3">
          <Ads />
          <BirthDays />
          <Contacts />
        </div>
      </div>
    </div>
  )
}

export default Home