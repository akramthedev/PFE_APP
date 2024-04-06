import React, {useEffect, useRef, useState} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'
import formatCreatedAt from '../../Helpers/GetTimeAndDate';
import axios from 'axios';


const Post = ({ajusting, post, index, isFetchingUser, dataUserCurrent}) => {


    const naviagte = useNavigate();
    const postRef = useRef(null);
    
    const [isCommentClicked, setIsCommentClicked] = useState(false);
    const [isLoveClick, setIsLoveClick] = useState(false);
    const [IsBookMarked, setIsBookMarked] = useState(false);

    const [numberComment, setnumberComment] = useState(null);
    const [numberLikes, setnumberLikes] = useState(null);
    const [numberViews, setnumberViews] = useState(null);
    const [isSeen, setIsSeen] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);

    const startTimeRef = useRef(null);
    const stopTimeRef = useRef(null);

    useEffect(()=>{
        if(post){
            setnumberLikes(post.likes.length);
            setnumberComment(post.comments.length);
            setnumberViews(post.views);
        }
    }, []);



    const addViewToPost = async ()=>{
        try{
            const resp = await axios.get(`http://localhost:3001/post/addView/${post._id}`);
            if(resp.status === 200){
                setnumberViews(resp.data.views);
            }
        }
        catch(e){
            console.log(e.message);
        }
    }





    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isSeen) {
                    setIsSeen(true);
                    setnumberViews(number => number + 1);
                    addViewToPost();
                }
            },
            {
                root: null, // viewport
                rootMargin: '0px', // margin around the root
                threshold: 0.666, // 66.6% of the element visible
            }
        );

        if (postRef.current) {
            observer.observe(postRef.current);
        }

        // Cleanup function
        return () => {
            if (postRef.current) {
                observer.unobserve(postRef.current);
            }
        };
    }, [postRef, isSeen]);



    return (
        <>
        {
            post && <div className={ajusting === "yes" ? "Post ajustPost" : "Post"}>
        <div  ref={postRef} className=" rowP0 rowP1">
            <div className="c1"
                onClick={()=>{
                    naviagte(`/profile/${post.creator}`);
                }}
            >
                <div className="c11">
                    <img src="https://akramelbasri.com/static/media/img.bbbb721ddafd04f09a9d.png" alt="" />
                </div>
                <div className="c12">
                    <span>Akram El Basri</span>
                    <span>seasonedwebdev@gmail.com</span>
                </div>
            </div>
            <div 
                className={IsBookMarked ? "c2" : "c2"}
                onClick={()=>{
                    setIsBookMarked(!IsBookMarked);
                }}
            >
            {
                !IsBookMarked ? 
                <i class="fa-regular fa-bookmark"></i>
                :
                <i className="fa-solid fa-bookmark"></i>
            }
            </div>
        </div>
        {post.description !== "" &&
        <div className=" rowP0 rowP2">
            {post.description}
        </div>
        }
        {
            post.image !== "" && 
            <div className=" rowP0 rowP3">
                <img 
                    src={post.image}
                    alt=""
                />
            </div>
        }
        <div className="rowP0 rowP4">
        {
            formatCreatedAt(post.createdAt)
        }
        </div>
        <div className="rowP0 rowP5">
            
          
            <button
                className='lsc'
                onClick={()=>{
                    if(isLoveClick){
                        setnumberLikes(numberLikes-1);
                        setIsLoveClick(false);
                        //axios request here 
                    }
                    else{
                        setnumberLikes(numberLikes+1);
                        setIsLoveClick(true);
                        //axios request here 

                    }
                }}
            >
                {numberLikes}
                {
                    isLoveClick ? 
                    <i className="fa-solid fa-heart fa-heartRED"></i>
                    :
                    <i className="fa-regular fa-heart"></i>
                }
            </button>
 
            <button
                className='lsc'
                onClick={()=>{
                    setIsCommentClicked(!isCommentClicked);
                    setTimeout(()=>{
                        if(isCommentClicked){
                            //scroll to top 
                            window.scrollTo({
                                top:window.scrollY - 100, 
                                behaviort : 'smooth'
                            })
                        }
                        else{
                            //scroll  to bottom 
                            window.scrollTo({
                                top :window.scrollY + 100, 
                                behaviort : 'smooth'
                            })
                        }
                    },200);
                }}
            >
                {numberComment}
                {
                    isCommentClicked ? 
                    <i className="fa-solid fa-comment"></i>
                    :
                    <i className="fa-regular fa-comment"></i>
                }
            </button>
            
            <button
                className=' lsc lsclsc'
            >
                {numberViews}
                <i class="fa-solid fa-chart-simple"></i>
            </button>   


        </div>
        <div className={isCommentClicked ? "rowP6 showrowP6" : "rowP6"}>

        </div>
    </div>
    }
    </>
  )
}

export default Post