import React, {useState, useEffect} from 'react'
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';
import CreatePost from '../../Components/CreatePost/CreatePost';
import Post from '../../Components/Post/Post';


const Home = () => {


  return (
    <div className='Home'>
      <Navbar />
      <div className="home2">
        <div className="h1">

        </div>
        <div className="h2">
          <CreatePost />
          <Post />
          <Post />
          <Post />
        </div>
        <div className="h3">

        </div>
      </div>
    </div>
  )
}

export default Home