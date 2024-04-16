import React, { useState } from 'react'
import './index.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


const Help = () => {

  const nav = useNavigate();

  return (
    <div className='Help'>
      <div onClick={()=>{nav('/')}} className="backHome">
        <i className='fa-solid fa-arrow-left'></i>&nbsp;&nbsp;Back Home
      </div>
      <div className="container368 container763">
        
        <div className="row66 row65 row65row65">
          <i style={{fontSize : "14px"}} className='fa-solid fa-thumbtack'></i>&nbsp;&nbsp;&nbsp;Help And Support
        </div> 
        <br />
        <div className="row66 row78">
          <span>How do I change my profile picture?</span>
          <p>To change your profile picture, simply navigate to your profile page and tap/click on your current profile picture. You'll see an option to upload a new picture from your device's gallery or take a new photo using your camera.</p>
        </div>
        <div className="row66 row78">
          <span>
          What privacy settings are available for my account?
          </span>
          <p>
          Our app offers a range of privacy settings to control who can see your posts, profile information, and contact you. You can adjust these settings by going to your account settings and selecting the privacy options. Here, you can customize settings such as who can see your posts, who can send you friend requests, and more.
          </p>
        </div>

        <div className="row66 row78">
          <span>
          How can I block or report a user?
          </span>
          <p>
          If you encounter a user who is behaving inappropriately or violating our community guidelines, you can block or report them. Simply go to their profile, tap/click on the three dots (...) or the "More" option, and select "Block" or "Report". Follow the prompts to complete the action.
          </p>
        </div>


        <div className="row66 row78">
          <span>
          How do I create a new post or share content?
          </span>
          <p>
          To create a new post, go to the homepage or your profile page and look for the "Create Post" button. Click/tap on it, then type your message or upload your content (photo, video, etc.). Once you're done, you can add any additional details and then click/tap "Post" to share it with your followers.
          </p>
        </div>

        <div className="row66 row78">
          <span>
          What are the different notification settings and how can I customize them?
          </span>
          <p>
          You can manage your notification settings by going to your account settings and selecting the "Notifications" tab. Here, you can customize which types of notifications you want to receive (e.g., likes, comments, friend requests) and how you want to be notified (e.g., push notifications, email).
          </p>
        </div>

        <div className="row66 row78">
          <span>
          How can I find friends or connect with other users?
          </span>
          <p>
          You can find friends or connect with other users by searching for their name or username in the search bar. Additionally, you can explore suggested friends based on mutual connections or shared interests. Once you find someone you want to connect with, you can send them a friend request or follow them.
          </p>
        </div>

        <div className="row66 row78">
          <span>
          Is there a way to temporarily deactivate or delete my account?
          </span>
          <p>
          Yes, you can deactivate or delete your account by going to your account settings and selecting the "Deactivate Account" or "Delete Account" option. Follow the prompts to complete the process. Keep in mind that deactivating your account will temporarily hide your profile and content, while deleting your account will permanently remove all your information from our platform.
          </p>
        </div>


      </div>
    </div>
  )
}

export default Help