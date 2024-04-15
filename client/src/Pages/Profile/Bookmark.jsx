import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import formatCreatedAt from '../../Helpers/GetTimeAndDate';
import SingleComment from '../../Components/SingleComment/SingleComment';
import Adser from "../../Assets/AdserSymbol";
import Admin from '../../Assets/AdminSymbol';


const Bookmark = ({isFetchingUser, index, dataUserCurrent, bookmark}) => {

    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const dataRef = useRef(null);
    const [deleteLoader, setDeleteLoader] = useState(false);    
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



    const fetchUser = async (dataX)=>{
        if(dataX  && token){
        try{
            const resp = await axios.get(`http://localhost:3001/user/${dataX.creator}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
            });
            if(resp.status === 200){
                setdataAuthorPost(resp.data);
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
            if(dataUserCurrent && data){
                if(dataUserCurrent.bookmarks.includes(data._id)){
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
        const fetchPost = async()=>{
            try{    
                const resp = await axios.get(`http://localhost:3001/post/${bookmark}`);
                if(resp.status === 200){
                    setData(resp.data);
                    fetchUser(resp.data);
                }
                else{
                    setData(null);
                }
            }
            catch(e){
                setData(null);
                console.log(e.message);
            }
        }
        fetchPost();
    }, [bookmark]);



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
                    idPost : bookmark,
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
            await axios.get(`http://localhost:3001/user/updateBookMark/${idUser}/${bookmark}`, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
        }
        catch(e){
            console.log(e.message);
        }
    }



    const handleLick = async ()=>{
        try{
            await axios.get(`http://localhost:3001/post/likeProcess/${bookmark}`,  {
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
    <React.Fragment key={index} >
    {
        data && 
        <div className="Post PostAjusting" >
            

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
            {
                dataAuthorPost && 
            <div  ref={dataRef} className=" rowP0 rowP1">
                <div className="c1"
                    onClick={()=>{
                        navigate(`/profile/${data.creator}`);
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
                    dataAuthorPost._id !== idUser ? 
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
                    :
                    null
                }
            </div>
            }   
            {data.description !== "" &&
            <div className=" rowP0 rowP2">
                {data.description.split('\n').map((line, index) => (
                    <>
                    {line}
                    <br />
                    </>
                ))}
            </div>
            }
            {
                data.image !== "" && 
                <div className=" rowP0 rowP3">
                    <img 
                        onClick={()=>{
                            setisImgClicked(true);
                            setImgSrcClicked(data.image)
                        }}
                        src={data.image}
                        alt=""
                    />
                </div>
            }
            <div className="rowP0 rowP4">
            {
                formatCreatedAt(data.createdAt)
            }
            </div>
        </div>
    }
    </React.Fragment>
  )
}

export default Bookmark