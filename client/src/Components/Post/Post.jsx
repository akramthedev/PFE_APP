import React, {useEffect, useRef, useState, useMemo} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'
import Loader from '../../Assets/spin1.svg';
import formatCreatedAt from '../../Helpers/GetTimeAndDate';
import axios from 'axios';
import SkeltonPost from './SkeltonPost';
import SkeltonPost2 from './SkeltonPost2';
import SingleComment from '../SingleComment/SingleComment';
import Adser from "../../Assets/AdserSymbol";
import Admin from '../../Assets/AdminSymbol';



const colors = [
    { color: '#7600e5', weight: 3 },   // Higher weight for this color
    { color: '#ed4700', weight: 2 },
    { color: '#008200', weight: 2 },
    { color: '#ac009a', weight: 2 },
    { color: '#c00000', weight: 2 },
    { color: '#2b3de2', weight: 2 },
    { color: '#000000', weight: 1 },   // Lower weight for this color
    { color: '#ae8000', weight: 1 }
];

// Calculate total weight
const totalWeight = colors.reduce((acc, cur) => acc + cur.weight, 0);

// Function to generate a random color
const getRandomColor = () => {
    let randomNumber = Math.random() * totalWeight;
    for (const color of colors) {
        if (randomNumber < color.weight) {
            return color.color;
        }
        randomNumber -= color.weight;
    }
};




const Post = ({reRenderParentCompo, state, state2,state3, ajusting, post, index, isFetchingUser, dataUserCurrent}) => {


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
        const x = ()=>{
            if(dataUserCurrent){
                if(dataUserCurrent.bookmarks.includes(post._id)){
                    setIsBookMarked(true);
                }
                else{
                    setIsBookMarked(false);
                }
            }
        }
        x();
    }, [dataUserCurrent]);

    
    useEffect(()=>{
        if(idUser === post.creator){
            setAllComments([]);
            setnumberComment(0);
            setnumberLikes(0);
            setnumberViews(0);
        }
        fetchUser();
    }, [state, state2, state3]);



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

    const [deleteLoader, setDeleteLoader] = useState(false);

    const handleDeletePost = async()=>{
        try{
            setDeleteLoader(true);
            const resp = await axios.delete(`http://localhost:3001/post/${post._id}`);
            if(resp.status === 200){
                reRenderParentCompo();
                setDeleteLoader(false);
            }
            else{
                setIsDeleted(false);
                reRenderParentCompo();
                setDeleteLoader(false);
            }
        }
        catch(e){
            setDeleteLoader(false);
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


    const handleBookMarkClick = async()=>{
        setIsBookMarked(!IsBookMarked);
        try{
            await axios.get(`http://localhost:3001/user/updateBookMark/${idUser}/${post._id}`, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
        }
        catch(e){
            console.log(e.message);
        }
    }



    /*
    const memoizedColors = useMemo(() => {
        const memoizedColors = {};
        post.topic.forEach((topic, index) => {
            memoizedColors[topic.category] = getRandomColor();
        });
        return memoizedColors;
    }, [post.topic]);

    */


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
                        navigate(`/profile/${post.creator}`);
                    }}
                >
                    <div className="c11">
                        <img src={dataAuthorPost.profilePic} alt="" />
                    </div>
                    <div className="c12">
                        <span>{dataAuthorPost.fullName}&nbsp;&nbsp;{dataAuthorPost.role === "admin" ? <Admin /> : dataAuthorPost.role === "adser" ? <Adser /> : null}</span>
                        <span>{dataAuthorPost.email}&nbsp;{dataAuthorPost._id === idUser && <>(you)</>}</span>
                    </div>
                </div>
                {
                    dataAuthorPost._id === idUser ? 
                    <div 
                        className="c2"
                        onClick={()=>{
                            handleDeletePost();
                        }}
                    >
                    {
                        !isDeleted &&
                        <>
                        {
                            deleteLoader ? 
                            <img 
                                src={Loader}
                            />
                            :
                            <i class="fa-solid fa-trash"></i>
                        }
                        </>
                    }
                    </div>
                    :
                    <div 
                        className={IsBookMarked ? "c2" : "c2"}
                        onClick={()=>{
                            handleBookMarkClick();
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
            {post.topic && post.topic.length !== 0 &&
                        
                <div className="rowP0 rowP2">
                    {post.topic.map((topic, index) => (
                    <div key={index} className={`topic`} style={{ backgroundColor: topic.backgroundColor}}>
                        {topic.category}
                    </div>
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

export default Post