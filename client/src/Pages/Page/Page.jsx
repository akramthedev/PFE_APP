import React, {useState, useEffect, useRef} from 'react'
import './index.css';
import '../Home/Home.css'
import PagePost from '../../Components/Post/PagePost.jsx';
import axios from 'axios';
import CreatePostForPages from '../../Components/CreatePost/CreatePostForPages.jsx'
import { useSocket } from '../../Helpers/SocketContext';
import SkeltonPost2 from '../../Components/Post/SkeltonPost2.jsx';
import SingleContact from '../../Components/SingleContact/SingleContact.jsx';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import Navbar from '../../Components/Navbar/Navbar';
import {useNavigate, useParams } from 'react-router-dom'
import VerifiedPage from '../../Assets/VerifiedPage.jsx';
import useOutsideAlerter from '../../Helpers/HidePopUp.js';
import { TheOneWhoHasBirthDay } from '../Home/TheOneWhoHasBirthDay.jsx';
import formatCreatedAt from '../../Helpers/GetTimeAndDate.js';




const Page = ({dataAds, fetchUser,isFetchingUser, dataUserCurrent, reRenderParentCompo}) => {

  const { id } = useParams();
  const { socket } = useSocket();
  const token = localStorage.getItem('token');
  const currentId = localStorage.getItem('idUser');
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [allPostsWithImages, setallPostsWithImages] = useState([]);
  const [postLoading, setpostLoading] = useState(true);
  const [isFollowed, setisFollowed] = useState(null);
  const [isLiked, setISLiked] = useState(null);
  const [isBClicked,setisBClicked] = useState(false);
  const [TheOnesWhoHaveBirthday,setTheOnesWhoHaveBirthday] = useState(null);
  const refref = useRef(null); 
  const refrefref = useRef(null); 
  const [LikesNumber, setLikesNumber] = useState(null);
  const [FollowersNumber,setFollowersNumber] = useState(null);
  const [showVerifiedPopUp,setshowVerifiedPopUp] = useState(false);
  const [isVerified,setisVerified] = useState(false);
  const [owner,setowner] = useState(null);


  const [isHomeClicked,setisHomeClicked] = useState(true);
  const [isMediaClicked,setisMediaClicked] = useState(false);
  const [isOwnerClicked,setisOwnerClicked] = useState(false);


  useOutsideAlerter(refref, setisBClicked);
  useOutsideAlerter(refrefref, setshowVerifiedPopUp);

  const [data, setData] = useState(null);


  const fetch = async()=>{
    if(id){
      try{
        const resp = await axios.get(`http://localhost:3001/page/${id}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          if(resp.data.likes.includes(currentId)){
            setISLiked(true);
          } 
          else{
            setISLiked(false);
          } 
          setLikesNumber(resp.data.likes.length);
          setFollowersNumber(resp.data.followers.length);
          if(resp.data.followers.includes(currentId)){
            setisFollowed(true);
          } 
          else{
            setisFollowed(false);
          } 
          setData(resp.data);
          const respowner = await axios.get(`http://localhost:3001/user/${resp.data.creator}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(respowner){
            setowner(respowner.data);
          }
          else{
            setowner(null);
          }
        }
        else{
            console.log("Error");
        }
      }
      catch(e){
          console.log(e.message);
          console.log("Error");
        }
    }
}

  useEffect(()=>{
      fetch();
  }, [id]);

    const renderParent = async ()=>{
        try{
          setpostLoading(true);
          const resp = await axios.get(`http://localhost:3001/post/user/${id}`);
          if(resp.status === 200){
            setAllPosts(resp.data);
            if(resp.data.length !== 0){
              setTimeout(()=>{
                setallPostsWithImages(null);
                setallPostsWithImages([]);
                resp.data.map((post, index)=>{
                  if(post.image !== ''){
                    setallPostsWithImages(prevPosts=>[
                      ...prevPosts, 
                      post.image
                    ])
                  }
                })
              }, 700 );
            }
          }
          else{
            setAllPosts([]);
          }
        }
        catch(e){
          console.log(e.message);
        } finally{
          setpostLoading(false);
        }
      
    }

    useEffect(()=>{
      renderParent();
    }, [id]);
  

    const handleLike = async()=>{
      try{
        await axios.post('http://localhost:3001/page/likethepage', {
          idLiker : currentId, 
          idPageLiked : data._id
        }, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
      }
      catch(e){
        console.log(e.message);
      }
    }

    
    const handleFollow = async()=>{
      try{
        await axios.post('http://localhost:3001/page/followThePage', {
          idFollower : currentId, 
          idPageFollowed : data._id
        }, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        fetchUser();
      }
      catch(e){
        console.log(e.message);
      }
    }
    

    const handleVerifyPage = async()=>{
      if(currentId){
        try{
          const resp = await axios.post('http://localhost:3001/page/verification-page-data', {
            idPage : id, 
            idUser : currentId
          }, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          console.log("---------------------------");
          console.log(resp.data);
          console.log("---------------------------");
          if(resp.status === 200){
            setisVerified(true);
            setTimeout(()=>{
              setshowVerifiedPopUp(true);
            }, 200);
          }
          else{
            setisVerified(false);
            console.log("Not Verified");
          }
        }
        catch(e){
          console.log(e.message);
        }
      }
    }
    

    useEffect(()=>{
      handleVerifyPage();
    }, [currentId]);
  

  return (
    <>
      <div className={showVerifiedPopUp ? "showVerifiedPopUp VerifiedPopUp" : "VerifiedPopUp"}>
        <div ref={refrefref} className={showVerifiedPopUp ? "divX showdivX" : "divX"}>
          <div className="row93791 row87824">
            <VerifiedPage /> Congratulations! Your page has been successfully verified. 
          </div>
          <div className="row93791">
             Indicating authenticity and credibility to your audience. This succinctly conveys the purpose and significance of the verification badge to the page owner.
          </div>
          <div className="row93791">
            Keep up the great work!
          </div>
          <div className="row93791">
            <img src="https://res.cloudinary.com/dqprleeyt/image/upload/v1712318887/and_parkle___3_-removebg-preview_lyfila.png" alt="" />
          </div>
        </div>
      </div>
      <div className='Home Page'>

          <div className={isBClicked ? "isBClicked showisBClicked" : "isBClicked"}>
            <div ref={refref} className={isBClicked ? "isContainerB showisContainerB" : "isContainerB"}>
            <div className="rowzodjq">
              Wish a Happy Birthday!
            </div>
            {
              TheOnesWhoHaveBirthday && 
              TheOnesWhoHaveBirthday.length !== 0 && 
              TheOnesWhoHaveBirthday.map((one, index)=>{
                return(
                  <TheOneWhoHasBirthDay  one={one} dataUserCurrent={dataUserCurrent} />
                )
              })
            }
            </div>
          </div>
      


        <Navbar  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent}  />
          <div className="home2">
            <div className="h1">
              <div className="rowImg878">
                <img src={data && data.profilePic} alt="" />
              </div>
              <div className="rowName878">
              {
                data && data.name
              }
              </div>
              {
                (data && (data.isVerified || isVerified ))&&
               
                <div className="rowName879">
                Verified By Xplorium
                 
                  <VerifiedPage />
                 
                </div>
                
              }
              <div className="rowName8790">
                <span>Likes</span><span>{data && LikesNumber && LikesNumber}</span>                
              </div>
              <div className="rowName8790">
                <span>Followers</span><span>{data && FollowersNumber && FollowersNumber}</span>               
              </div>
              <div className="rowName8790">
                <span>Posts</span><span>{allPosts && allPosts.length}</span>               
              </div>
              <div
                onClick={()=>{
                  setisOwnerClicked(false)
                  setisMediaClicked(false);
                  setisHomeClicked(true);
                }}
                className={isHomeClicked ? "rowName899activated rowName899" : "rowName899"}>
                <div className={isHomeClicked ? "barActivated bar" : "bar"}  /> 
                Home
              </div>
              <div 
                onClick={()=>{
                  setisOwnerClicked(false)
                  setisHomeClicked(false);
                  setisMediaClicked(true);
                }}
                className={isMediaClicked ? "rowName899activated rowName899" : "rowName899"}>
                <div className={isMediaClicked ? "barActivated bar" : "bar"}  /> 
                Photos
              </div>
              <div 
                onClick={()=>{
                  setisHomeClicked(false);
                  setisMediaClicked(false);
                  setisOwnerClicked(true)
                }}
                className={isOwnerClicked ? "rowName899activated rowName899" : "rowName899"}>
                <div className={isOwnerClicked ? "barActivated bar" : "bar"}  /> 
                 Owner
              </div>
            </div>
            <div className="h2">
              <div className="coverPicture99">
                <img src={ data && data.coverPic} alt="" />
              </div>
              <div className="btnsbts">
              {
                data && 
                <>
                {
                    currentId === data.creator ? 
                    <>
                      <button

                      >
                        Modify Your Page
                      </button>
                    </>
                    :
                    <>
                    {
                        isLiked !== null && 
                        <>
                          <button
                            onClick={()=>{
                              if(isLiked){
                                setISLiked(false);
                                setLikesNumber(LikesNumber-1);
                              }
                              else{
                                setISLiked(true);
                                setLikesNumber(LikesNumber+1)
                              }
                              handleLike();
                            }}
                            className={isLiked && "addColorActivatedL"}
                          >
                          {
                            isLiked ? 
                            <>Liked&nbsp;&nbsp;<i className='fa-solid fa-check'></i> </>
                            :
                            <>Like&nbsp;&nbsp;<i className='fa-solid fa-thumbs-up'></i> </>
                          }
                          </button>
                        </>
                      }
                      {
                        isFollowed !== null && 
                        <button
                          className={isFollowed && "addColorActivatedF"}
                          onClick={()=>{
                            if(isFollowed){
                              setisFollowed(false);
                              setFollowersNumber(FollowersNumber-1);
                            }
                            else{
                              setisFollowed(true);
                              setFollowersNumber(FollowersNumber+1)
                            }
                            handleFollow();
                          }}
                        >
                        {
                          isFollowed ? 
                          <>Followed&nbsp;&nbsp;<i className='fa-solid fa-check'></i></>
                          :
                          <>Follow&nbsp;&nbsp;<i className='fa-solid fa-signal'></i></>
                        } 
                        </button> 
                      } 
                    </>
                  }
                </>
              }
              
              </div>
              {
                data && (data.creator === currentId) && 
                <CreatePostForPages pageId={id} ajusting={"yes"} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} renderParent={renderParent} />
              }
              {
                isHomeClicked  ? 
                <>
                  {
                  postLoading ? "Loading.."
                  :
                  <>
                  {
                    allPosts && 
                    <>
                    {
                      allPosts.length === 0 ?
                      <div className="rowName899 rowName899rowName899rowName899">
                        No Post Yet
                      </div>
                      :
                      allPosts.map((post, index)=>{
                        return(
                          <PagePost ajusting={"yes"} post={post}  reRenderParentCompo={renderParent}  />
                        )
                      })
                    }
                    </>
                  }
                  </>
                }
                </>
                : isMediaClicked ? 
                <>
                  {
                  postLoading ? "Loading.."
                  :
                  <>
                  {
                    allPostsWithImages && 
                    <>
                    {
                      allPostsWithImages.length === 0 ?
                      <div className="rowName899 rowName899rowName899rowName899">
                        No data
                      </div>
                      :
                      <div className="allMediaOfThePage">
                      {
                        allPostsWithImages.map((image, index)=>{
                          return(
                            <img 
                              className='scdsho'
                              alt='vid'
                              src={image}
                            />
                          )
                        })
                      }
                      </div>
                      
                    }
                    </>
                  }
                  </>
                }
                </>
                : isOwnerClicked &&
                <div className="ownerclicked">
                {
                  owner=== null ? <span style={{color : "gainsboro"}}>No Data</span> :
                  <>
                    <div className="rowpictureKQEDF">
                      <img src={owner.profilePic}  alt="" />
                      <div className="infoshhh">
                        <span>{owner.fullName}</span>
                        <span>{owner.email}</span>
                        <span>Joined at {formatCreatedAt(owner.createdAt)}</span>
                      </div>
                       
                      <button 
                        onClick={()=>{
                          navigate(`/profile/${owner._id}`)
                        }}
                        className="gotoprofile"
                      >
                        {
                          owner._id == currentId ? "Go to your profile":"Visit his Profile"
                        }
                        
                      </button>
                     
                    </div>
                    
                  </>
                }
                </div>
              }
            </div>
            <div className="h3">
              <Ads dataAds={dataAds}  />
              <BirthDays  setisBClicked={setisBClicked} setTheOnesWhoHaveBirthday={setTheOnesWhoHaveBirthday }   isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts    isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}   />
            </div>
          </div>
      </div>
   
    </>
  )
}

export default Page