import React, {useState} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'

const PostSuggestedUsers = () => {


    const naviagte = useNavigate();
 

    return (
    <div className='Post'>
        <div className="jack">
            show some suggested users list with a scroll-x 
        </div>
    </div>
    )
}


export default PostSuggestedUsers;