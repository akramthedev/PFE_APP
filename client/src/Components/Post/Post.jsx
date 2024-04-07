import React, {useEffect, useRef, useState} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'
import formatCreatedAt from '../../Helpers/GetTimeAndDate';
import axios from 'axios';
import SkeltonPost from './SkeltonPost';
import SkeltonPost2 from './SkeltonPost2';



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



    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');

    const [loadingDataUser, setloadingDataUser] = useState(true);
    const [dataAuthorPost, setdataAuthorPost] = useState(null);

    
    const fetchUser = async ()=>{
        if(post  && token){
        try{
            const resp = await axios.get(`http://localhost:3001/user/${post.creator}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
            });
            if(resp.status === 200){
                setdataAuthorPost(resp.data);
                //handling the likes 
                if(post.likes.includes(idUser)){
                    setIsLoveClick(true);
                }
                else{
                    setIsLoveClick(false);
                }
            }
            else{
                alert('Error');
            }
        }
        catch(e){
            console.log(e.message);
            alert('Error');
        } finally{
            setloadingDataUser(false);
        }
        }
    }


    
    useEffect(()=>{
        fetchUser();
    }, []);



    useEffect(()=>{
        if(post){
            setnumberLikes(post.likes.length);
            setnumberComment(post.comments.length);
            setnumberViews(post.views);
        }
    }, []);



    const addViewToPost = async ()=>{
        if(post){
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
    }





    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {     
                if(post){    
                    if (entry.isIntersecting && !isSeen) {
                        setIsSeen(true);
                        setnumberViews(number => number + 1);
                        addViewToPost();
                    }
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
    }, [postRef, isSeen, idUser, loadingDataUser, dataAuthorPost]);


    const handleLick = async ()=>{
        try{
            await axios.get(`http://localhost:3001/post/likeProcess/${post._id}`,  {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
        }
        catch(e){
            console.log(e.message);
        }
        
    }


    return (
        <>
        {
        
        (post && !loadingDataUser && dataAuthorPost) ? 
        <div className={ajusting === "yes" ? "Post ajustPost" : "Post"}>
        
            <div  ref={postRef} className=" rowP0 rowP1">
                <div className="c1"
                    onClick={()=>{
                        naviagte(`/profile/${post.creator}`);
                    }}
                >
                    <div className="c11">
                        <img src={dataAuthorPost.profilePic} alt="" />
                    </div>
                    <div className="c12">
                        <span>{dataAuthorPost.fullName}</span>
                        <span>{dataAuthorPost.email}</span>
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
                            handleLick();
                        }
                        else{
                            setnumberLikes(numberLikes+1);
                            setIsLoveClick(true);
                            //axios request here 
                            handleLick();
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
        :
        <>
        {
            ajusting === "yes" ? <SkeltonPost2/> : <SkeltonPost/>
        }
        </>
    }
    </>
  )
}

export default Post