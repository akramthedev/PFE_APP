import React, {useState} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'

const PostAds = () => {


    const naviagte = useNavigate();

    const [isCommentClicked, setIsCommentClicked] = useState(false);
    const [isLoveClick, setIsLoveClick] = useState(false);
    const [isAddNewFriend, setisAddNewFriend] = useState(false);


    return (
    <div className='Post'>
        <div className="jack">
            show Adss Here
        </div>
    </div>
    )
}


export default PostAds;