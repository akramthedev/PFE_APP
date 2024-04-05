import React, {useState, useEffect} from 'react'
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';
import CreatePost from '../../Components/CreatePost/CreatePost';


const Home = () => {


  return (
    <div className='Home'>
      <Navbar />
      <div className="home2">
        <div className="h1">

        </div>
        <div className="h2">
          <CreatePost />
        </div>
        <div className="h3">

        </div>
      </div>
    </div>
  )
}

export default Home