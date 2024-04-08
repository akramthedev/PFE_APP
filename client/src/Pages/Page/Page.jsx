import React, {useState, useEffect, useRef} from 'react'
import './index.css';
import '../Home/Home.css'
import axios from 'axios';
import CreatePostForPages from '../../Components/CreatePost/CreatePostForPages.jsx'
import { useSocket } from '../../Helpers/SocketContext';
import SkeltonPost2 from '../../Components/Post/SkeltonPost2.jsx';
import SingleContact from '../../Components/SingleContact/SingleContact.jsx';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import Navbar from '../../Components/Navbar/Navbar';
import HidePopUp from '../../Helpers/HidePopUp.js'
import {useNavigate, useParams } from 'react-router-dom'

import VerifiedPage from '../../Assets/VerifiedPage.jsx';




const Page = ({isFetchingUser, dataUserCurrent, reRenderParentCompo}) => {

  const { id } = useParams();
  const { socket } = useSocket();
  const token = localStorage.getItem('token');
  const currentId = localStorage.getItem('idUser');
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [allPostsWithImages, setallPostsWithImages] = useState([]);
  const [postLoading, setpostLoading] = useState(true);

  const [data, setData] = useState(null);


  useEffect(()=>{
      const fetch = async()=>{
          if(id){
            try{
              const resp = await axios.get(`http://localhost:3001/page/${id}`, {
                headers : {
                  Authorization : `Bearer ${token}`
                }
              });
              if(resp.status === 200){
                  setData(resp.data);
              }
              else{
                  navigate("/");
              }
            }
            catch(e){
                console.log(e.message);
                navigate("/");
            }
          }
      }
      fetch();
  }, []);

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
    }, []);
  
  

  return (
    <>
    {
      data && 
      <div className='Home Page'>
        <Navbar  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent}  />
          <div className="home2">
            <div className="h1">
              <div className="rowImg878">
                <img src={data.profilePic} alt="" />
              </div>
              <div className="rowName878">
              {
                data.name
              }
              </div>
              {
                data.isVerified &&
               
                <div className="rowName879">
                Verified By Xplorium
                 
                  <VerifiedPage />
                 
                </div>
                
              }
              <div className="rowName8790">
                <span>Likes</span><span>2478</span>                
              </div>
              <div className="rowName8790">
                <span>Followers</span><span>4278</span>               
              </div>
              <div className="rowName8790">
                <span>Posting</span><span>Every Day</span>               
              </div>
              <div className="rowName899 rowName899activated">
                <div className="bar barActivated"  /> 
                Home
              </div>
              <div className="rowName899 ">
                <div className="bar" /> 
                About
              </div>
              <div className="rowName899 ">
                <div className="bar" /> 
                Photos
              </div>
              <div className="rowName899">
                <div className="bar" /> 
                Page Owner
              </div>
            </div>
            <div className="h2">
              <div className="coverPicture99">
                <img src={data.coverPic} alt="" />
              </div>
              <div className="btnsbts">
                <button>
                  Liked&nbsp;&nbsp;<i className='fa-solid fa-check'></i> 
                </button>
                <button>
                  Followed&nbsp;&nbsp;<i className='fa-solid fa-check'></i> 
                </button>  
              </div>
              {
                data.creator === currentId && 
                <CreatePostForPages pageId={id} ajusting={"yes"} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} renderParent={renderParent} />
              }
              {
                postLoading ? "Loading.."
                :
                <>
                {
                  allPosts && 
                  <>
                  {
                    allPosts.length === 0 ? "No Post Yet..."
                    :
                    allPosts.map((post, index)=>{
                      return(
                        <>
                          <span>{post._id}</span>
                          <br />
                        </>
                      )
                    })
                  }
                  </>
                }
                </>
              }
            </div>
            <div className="h3">
              <Ads />
              <BirthDays  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts    isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}   />
            </div>
          </div>
      </div>
    }
    </>
  )
}

export default Page