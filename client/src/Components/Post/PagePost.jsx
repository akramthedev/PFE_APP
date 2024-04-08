import React, {useEffect, useRef, useState} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'
import formatCreatedAt from '../../Helpers/GetTimeAndDate';
import axios from 'axios';
import SkeltonPost from './SkeltonPost';
import SkeltonPost2 from './SkeltonPost2';
import SingleComment from '../SingleComment/SingleComment';
import VerifiedPage from '../../Assets/VerifiedPage';


const PagePost = ({ajusting, post, index, isFetchingUser, dataUserCurrent, reRenderParentCompo}) => {


    const navigate = useNavigate();
    const postRef = useRef(null);
    
    const [isImgClicked, setisImgClicked] = useState(false);
    const [imgSrcClicked,setImgSrcClicked] = useState("");
    const [isCommentClicked, setIsCommentClicked] = useState(false);
    const [isLoveClick, setIsLoveClick] = useState(false);
    const [IsBookMarked, setIsBookMarked] = useState(false);
    const [isDeleted, setIsDeleted ] = useState(false);
    const [numberComment, setnumberComment] = useState(null);
    const [numberLikes, setnumberLikes] = useState(null);
    const [numberViews, setnumberViews] = useState(null);
    const [isSeen, setIsSeen] = useState(false);
    const [allComments, setAllComments] = useState(null);
    const [commentaire, setcommentaire] = useState("");
    const [dataCreatorOfPage, setdataCreatorOfPage]= useState(null);

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');

    const [loadingDataUser, setloadingDataUser] = useState(true);
    const [dataAuthorPost, setdataAuthorPost] = useState(null);

    
    const fetchUser = async ()=>{
        if(post  && token){
        try{
            const resp = await axios.get(`http://localhost:3001/page/${post.creator}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
            });
            if(resp.status === 200){
                const resp2 = await axios.get(`http://localhost:3001/user/${resp.data.creator}`, {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                });
                if(resp2.status === 200){
                    setdataCreatorOfPage(resp2.data);
                }
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
            setAllComments(post.comments);
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


    const handleDeletePost = async()=>{
        try{
            const resp = await axios.delete(`http://localhost:3001/post/${post._id}`);
            if(resp.status === 200){
                reRenderParentCompo();
            }
            else{
                setIsDeleted(false);
            }
        }
        catch(e){
            setIsDeleted(false);
        }
    }



    const handleSubmitcommentaire = async (ev)=>{
        ev.preventDefault();
        if(commentaire !== ""){
            setAllComments(prevComments => [
                ...prevComments, 
                { commentator: idUser, comment: commentaire, _id : "666" }
            ]);
            
            setnumberComment(number=>number+1);

            try{
                const resp = await axios.post(`http://localhost:3001/post/addComment`, {
                    idPost : post._id,
                    commentator : idUser, 
                    comment : commentaire
                });
                if(resp.status === 200){
                    setcommentaire("");
                }
                else{
                    setcommentaire("");
                }
            }
            catch(er){
                console.log(er.message);
            }
    
        }
    }



    return (
        <>
        {
        
        (post && !loadingDataUser && dataAuthorPost) ? 
        <div id={post._id}  className={ajusting === "yes" ? "Post ajustPost" : "Post"}>
            

                <div 
                    onClick={()=>{
                        setisImgClicked(false);
                        setImgSrcClicked('');
                    }}
                    className={isImgClicked ? "imageClickedFixedPosition showimageClickedFixedPosition" : "imageClickedFixedPosition"}
                    >
                    {
                    imgSrcClicked !== "" && 
                    <img 
                        src={imgSrcClicked}
                        alt=""
                    />
                    }
                </div>

            <div  ref={postRef} className=" rowP0 rowP1">
                <div className="c1"
                    onClick={()=>{
                        navigate(`/page/${post.creator}`);
                    }}
                >
                    <div className="c11">
                        <img src={dataAuthorPost.profilePic} alt="" />
                    </div>
                    <div className="c12">
                        <span>{dataAuthorPost.name}&nbsp;{dataAuthorPost && dataAuthorPost.isVerified && 
                        <svg className='sdqv' width="19"  height="19" viewBox="0 0 16 16" fill="none"><path d="M15.16 8c0 .65-.46 1.14-.86 1.57-.23.25-.47.5-.56.72-.1.22-.09.55-.1.88 0 .6-.01 1.3-.48 1.78-.48.48-1.16.5-1.75.5-.32 0-.65.01-.86.1-.2.07-.46.33-.7.57-.42.41-.9.88-1.54.88s-1.12-.47-1.54-.88a2.87 2.87 0 0 0-.7-.58c-.22-.09-.54-.08-.87-.09-.59 0-1.27-.02-1.74-.5s-.48-1.17-.49-1.78c0-.33-.01-.67-.1-.88-.07-.2-.32-.47-.55-.71-.4-.44-.87-.93-.87-1.58s.46-1.14.87-1.58c.23-.24.47-.5.56-.71.09-.22.08-.55.09-.88 0-.6.02-1.3.49-1.78s1.15-.5 1.74-.5c.33 0 .66-.01.86-.1.2-.08.47-.33.7-.57.43-.41.91-.88 1.55-.88.63 0 1.12.47 1.54.88.24.24.49.48.7.58.22.09.54.08.86.09.6 0 1.27.02 1.75.5.47.48.48 1.17.49 1.78 0 .33 0 .67.09.88.08.2.33.47.56.71.4.44.86.93.86 1.58z" fill="#437AFF"></path><path d="M7.33 10.5c.2 0 .38.08.52.22.13.14.21.33.21.53 0 .07.03.13.07.18a.24.24 0 0 0 .35 0 .25.25 0 0 0 .07-.18c0-.2.08-.39.22-.53a.73.73 0 0 1 .52-.22h1.96c.13 0 .25-.05.34-.15a.5.5 0 0 0 .15-.35V6a.5.5 0 0 0-.15-.35.48.48 0 0 0-.34-.15H9.78c-.33 0-.64.13-.87.37-.23.23-.36.55-.36.88v2.5c0 .07-.02.13-.07.18a.24.24 0 0 1-.35 0 .25.25 0 0 1-.07-.18v-2.5c0-.33-.13-.65-.36-.88a1.21 1.21 0 0 0-.86-.37H5.37a.48.48 0 0 0-.35.15.5.5 0 0 0-.14.35v4c0 .13.05.26.14.35.1.1.22.15.35.15h1.96z" fill="#fff"></path></svg>
                        }</span>
                        <span>By {dataCreatorOfPage && dataCreatorOfPage.fullName}&nbsp;{(dataCreatorOfPage && dataCreatorOfPage._id === idUser )&&<>(you)</>}</span>
                    </div>
                </div>
                {
                    dataAuthorPost.creator === idUser ? 
                    <div 
                        className="c2"
                        onClick={()=>{
                            handleDeletePost();
                        }}
                    >
                    {
                        !isDeleted &&
                        <i class="fa-solid fa-trash"></i>
                    }
                    </div>
                    :
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
                }
            </div>
            {post.description !== "" &&
            <div className=" rowP0 rowP2">
                {post.description.split('\n').map((line, index) => (
                    <>
                    {line}
                    <br />
                    </>
                ))}
            </div>
            }
            {
                post.image !== "" && 
                <div className=" rowP0 rowP3">
                    <img 
                        onClick={()=>{
                            setisImgClicked(true);
                            setImgSrcClicked(post.image)
                        }}
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
                <div className="containerOfAllComents">
                {
                    !allComments ? 
                    <div className='wdc'>
                        Fetching comments...
                    </div> 
                    :
                    <>
                    {
                        allComments.length !== 0 ?
                        allComments.map((comment, index)=>{
                            return(
                                <SingleComment comment={comment} />
                            )
                        })
                        :
                        <div className='wdc'>
                            No comment yet..
                        </div>
                    }
                    </>
                }
                </div>
                {
                    isCommentClicked && 
                    <form onSubmit={handleSubmitcommentaire}  className="writingcomment">
                        <input 
                            type="text"
                            placeholder='Write your comment...'
                            spellCheck={false}
                            value={commentaire}
                            onChange={(e)=>{setcommentaire(e.target.value);}}
                        />
                        <button
                            type='submit'
                        >
                            <i className='fa-solid fa-paper-plane'></i>
                        </button>
                    </form>
                }
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

export default PagePost;