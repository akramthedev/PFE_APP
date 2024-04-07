import React, { useState,useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../../Components/Post/Post.jsx';
import axios from 'axios';
import useOutsideAlerter from '../../Helpers/HidePopUp.js'
import Navbar from '../../Components/Navbar/Navbar';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import './index.css';
import '../Home/Home.css';
import AdminSymbol from '../../Assets/AdminSymbol.jsx';
import AdserSymbol from '../../Assets/AdserSymbol.jsx';
import CreatePost from '../../Components/CreatePost/CreatePost.jsx';
import { useSocket } from '../../Helpers/SocketContext';
import SkeltonPost from '../../Components/Post/SkeltonPost.jsx';



const Profile = ({ dataUserCurrent, isFetchingUser, fetchCurrentUser }) => {


  const { id } = useParams();
  let allPhotos = [];
  const { socket } = useSocket();
  const token = localStorage.getItem('token');
  const idVisited = id;
  const currentId = localStorage.getItem('idUser');
  const popUpRef = useRef(null); 
  const [loading, setLoading] = useState(true);
  const [visitedUser, setVisitedUser] = useState(null);
  const [isPostsClicked, setisPostsClicked] = useState(true);
  const [isMediaClicked, setisMediaClicked] = useState(false);
  const [isAboutClicked, setisAboutClicked] = useState(false);
  const [isContactsClicked, setisContactsClicked] = useState(false);
  const [isGroupsClicked, setisGroupsClicked] = useState(false);
  const [requestMade, setrequestMade] = useState(null);
  const [popUp, setpopUp] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [postLoading, setpostLoading] = useState(true);

  useOutsideAlerter(popUpRef, setpopUp);

  const fetchAllPosts = async ()=>{
    try{
      setpostLoading(true);
      const resp = await axios.get(`http://localhost:3001/post/user/${id}`);
      if(resp.status === 200){
        setAllPosts(resp.data);
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
    fetchAllPosts();
  }, [id]);


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      
      try {
        if (token && id) {

          

          const response = await axios.get(`http://localhost:3001/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setVisitedUser(response.data);

            if(id !== currentId){
            
              if(response.data.contacts.includes(currentId)){
                setrequestMade('contact');
              }
              else{
                    const response2 = await axios.post(`http://localhost:3001/request/checking`,{
                    currentId : currentId, 
                    idVisited : idVisited
                  }, {
                    headers: { 
                      Authorization: `Bearer ${token}`
                    }
                  });
                  if(response2.status === 200){
                    if(response2.data.sender === currentId){
                      console.log("Already Sent ")
                      setrequestMade("youAreTheSender");
                    }
                    else{
                      setrequestMade("heIsTheSender");
                      console.log("He sent you.. Wanna confirm or reject?")
  
                    }
                    console.log(response2.data); 
                  }
                  else{
                    setrequestMade("none");
                    console.log(response2.data);
                    console.log("You Can send a request for friendship.")
                  }
              }
  
  
            }


          } else {
            throw new Error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error(error);
        alert('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);


  useEffect(()=>{

    const x = ()=>{
      window.scrollTo({
        top: 0,
        left: 0,
        behavior : "instant",
      });    
    }
    x();

}, []);
   

  const HandleRemoveContact = async()=>{
    try{
      setrequestMade('none');
      const resp = await axios.post('http://localhost:3001/request/remove', {
        sender : currentId, 
        sentTo : id, 
        type : "twoPeople"
      });
      if(resp){
        setVisitedUser(prevVisitedUser => ({
          ...prevVisitedUser,
          contacts: prevVisitedUser.contacts.filter(contact => contact !== currentId)
        }));
        setrequestMade('none');
        fetchCurrentUser();
      }
      else{
        setrequestMade('none');
      }
    }
    catch(e){
      setrequestMade('none');
      console.log(e.message);
    }
  }


  const handleRequestClicked = async ()=>{
    try{
      if(visitedUser.contacts.includes(currentId)){
        HandleRemoveContact();
      }
      else{
        //now for the requestMade
        if(requestMade === "none" ){
          setrequestMade('youAreTheSender');
          //create request 
          const resp = await axios.post('http://localhost:3001/request/create', {
            sender : currentId, 
            sentTo : id, 
            type : "twoPeople"
          });
          if(resp.status === 200){
            console.log("Request Sent");
          }
          else{
            alert('Oops, something went wrong!');
          }
        }
        else if (requestMade === "heIsTheSender"){
          setpopUp(!popUp);
        }
        else{
          console.log('you can not do anything...');
        }
      }
    }
    catch(e){
      console.log(e.message);
    }
  }

  const handleRequestClicked2 = async (state)=>{
    if(visitedUser){
      setpopUp(!popUp);
        try{
          if(state === "accept"){
            //axios 
            setrequestMade("contact");
            await axios.post('http://localhost:3001/request/accept', {
              sender : visitedUser._id, 
              sentTo : currentId, 
              type : "twoPeople"
            });
            fetchCurrentUser();
          }
          else{
            setrequestMade("none");
            await axios.post('http://localhost:3001/request/reject', {
              sender : visitedUser._id, 
              sentTo : currentId, 
              type : "twoPeople"
            });
            fetchCurrentUser();
          }
        }
        catch(e){
          console.log(e.message);
        }
    }
  }

 


  return (
    <div className='Home Profile'>
      <Navbar isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
      <div className="home2">
        <div className="h0">
          {
            loading ? "Loading..."
            :
            <>
            {
              (visitedUser && dataUserCurrent) &&
              <>
              
                <div className="rowCover">
                  <img src={visitedUser.coverPic} alt="" />
                </div>
                <div className="rowProfPicAndFullName">
                  <img src={visitedUser.profilePic} alt="" />
                  <h1>
                    {visitedUser.fullName}&nbsp;&nbsp;
                    {
                      visitedUser.role === "admin" ? 
                      <AdminSymbol />
                      :
                      visitedUser.role === "adser" ? 
                      <AdserSymbol />
                      :
                      null
                    }
                  </h1>

                  {
                    (dataUserCurrent && (dataUserCurrent._id === id) ) ? 
                      <button 
                        onClick={()=>{
                          
                        }}
                        className="messageFriendShip"
                      >
                        <i className='fa-solid fa-pen'></i>&nbsp;Modify Profile
                      </button>
                    :
                    <>
                      <div ref={popUpRef} className={popUp ? "popUpx showpopUpx" : "popUpx"}>
                          <button
                            onClick={()=>{
                              setpopUp(!popUp);
                            }}
                            className="closePopUpx2"
                          >
                            <i className='fa-solid fa-xmark'></i>
                          </button>
                          <button
                            onClick={()=>{
                              handleRequestClicked2("accept")
                            }}
                            className='acc acc1'
                          >
                            Accept
                          </button>
                          <button
                            onClick={()=>{
                              handleRequestClicked2("reject")
                            }}
                            className='acc acc2'
                          >
                            Reject
                          </button>
                        </div>

                      <button 
                        onClick={()=>{
                          handleRequestClicked();
                        }}
                        key={popUp ? 134 : 234}
                        className="sendrequestFriendShip"
                      >
                        
                      {
                        visitedUser.contacts.includes(dataUserCurrent._id) ? 
                          <><i className='fa-solid fa-user-minus'></i>&nbsp;Remove Contact</>
                        :
                        <>
                        { 
                          requestMade && 
                          <>
                            {
                              requestMade === "none" ? 
                              <><i className='fa-solid fa-user-plus'></i>&nbsp;Add Contact</>
                              : requestMade === "youAreTheSender" ? 
                              <><i className='fa-solid fa-check'></i>&nbsp;Request Sent</>
                              : requestMade === "heIsTheSender" ?
                              <><i className='fa-solid fa-eye'></i>&nbsp;Request Received</>
                              : requestMade === "contact" &&
                              <><i className='fa-solid fa-user-minus'></i>&nbsp;Remove User</>

                            }                         
                          </>
                         }
                        </>
                      }
                      </button>
                      <button 
                        onClick={()=>{
                          
                        }}
                        className="messageFriendShip"
                      >
                        <i className='fa-solid fa-message'></i>&nbsp;Message
                      </button>
                  </>
                  }

                </div>
                <div className="rowYU">
                  <div className="BIOPHOTOS">
                    <div className="BIO">
                      <div className="About">
                        About
                      </div>
                      <div className="About About1">
                        {
                          visitedUser.bio
                        }
                      </div>
                      <div className="About About2">
                        <div className="caseOnA1">
                          <i className='fa-solid fa-envelope'></i>
                        </div>
                        <div className="caseOnA2">
                          {visitedUser.email}
                        </div>
                      </div>
                      {
                        visitedUser.phoneNumber && 
                        <div className="About About2">
                          <div className="caseOnA1">
                            <i className='fa-solid fa-phone'></i>
                          </div>
                          <div className="caseOnA2">
                            {visitedUser.phoneNumber}
                          </div>
                        </div>
                      }
                      {
                        visitedUser.portfolio && 
                        <div className="About About2">
                          <div className="caseOnA1">
                            <i className='fa-solid fa-globe'></i>
                          </div>
                          <div className="caseOnA2">
                            <a href={"https://"+visitedUser.portfolio} target='_blank' >{visitedUser.portfolio}</a>
                          </div>
                        </div>
                      }
                      {
                        visitedUser.address && 
                        <div className="About About2">
                          <div className="caseOnA1">
                            <i className='fa-solid fa-location-dot'></i>
                          </div>
                          <div className="caseOnA2">
                            {visitedUser.address}
                          </div>
                        </div>
                      }
                    </div>
                    <div className="Photos"
                      onClick={()=>{
                        if(!isMediaClicked){
                          setisAboutClicked(false);
                          setisGroupsClicked(false);
                          setisContactsClicked(false);
                          setisPostsClicked(false);
                          setisMediaClicked(true);
                        }
                      }}
                    >
                      <div className="About">
                        Media
                      </div>
                      <div className="AboutMedia">
                      {
                        allPhotos.length !== 0 ? 
                        allPhotos.slice(0, 9).map((photo, index) => {
                          return (
                            <img
                              src={photo}
                              key={index} // Consider using a more unique identifier for keys if available
                              alt={`${photo}-${index}`} // Changed the plus sign to a hyphen for standard alt text formatting
                            />
                          )
                        })
                        :
                        <span style={{fontSize : "13px", color : "gainsboro", textAlign : "center", width: "300px", marginTop : ".8rem"}}>
                          No media was found
                        </span>
                      }
                      </div>
                    </div>
                  </div>
                  <div className="OthersAndCreatePostAndPosts">

                    <div className="navabarOfProfile">
                      <button
                        onClick={()=>{
                          if(!isPostsClicked){
                            setisMediaClicked(false);
                            setisAboutClicked(false);
                            setisGroupsClicked(false);
                            setisContactsClicked(false);
                            setisPostsClicked(true);
                          }
                        }}
                        className={isPostsClicked && "AddColorBlueviolet"}
                      >
                        <i className='fa-solid fa-list'></i>
                        <span>Posts</span>
                      </button>
                      <button
                        className={isMediaClicked && "AddColorBlueviolet"}
                        onClick={()=>{
                          if(!isMediaClicked){
                            setisAboutClicked(false);
                            setisGroupsClicked(false);
                            setisContactsClicked(false);
                            setisPostsClicked(false);
                            setisMediaClicked(true);
                          }
                        }}
                      >
                        <i className='fa-solid fa-image'></i>
                        <span>Images</span>
                      </button>
                      <button
                        className={isAboutClicked && "AddColorBlueviolet"}
                        onClick={()=>{
                          if(!isAboutClicked){
                            setisMediaClicked(false);
                            setisGroupsClicked(false);
                            setisContactsClicked(false);
                            setisPostsClicked(false);
                            setisAboutClicked(true);
                          }
                        }}
                      >
                        <i className='fa-solid fa-address-card'></i>
                        <span>About</span>
                      </button>
                      <button
                        className={isContactsClicked && "AddColorBlueviolet"}
                        onClick={()=>{
                          if(!isContactsClicked){
                            setisMediaClicked(false);
                            setisAboutClicked(false);
                            setisGroupsClicked(false);
                            setisPostsClicked(false);
                            setisContactsClicked(true);
                          }
                        }}
                      >
                        <i className='fa-solid fa-user-group'></i>
                        <span>Contacts</span>
                      </button>
                      <button
                        className={isGroupsClicked && "AddColorBlueviolet"}
                        onClick={()=>{
                          if(!isGroupsClicked){
                            setisMediaClicked(false);
                            setisAboutClicked(false);
                            setisContactsClicked(false);
                            setisPostsClicked(false);
                            setisGroupsClicked(true);
                          }
                        }}
                      >
                        <i className='fa-solid fa-people-group'></i>
                        <span>Groups</span>
                      </button>
                    </div>

                    {
                      (dataUserCurrent && (dataUserCurrent._id === id))
                      &&
                      <CreatePost reRenderParentCompo={fetchAllPosts}  ajusting="profile" dataUserCurrent={dataUserCurrent} isFetchingUser={isFetchingUser} />
                    }

                    {
                      postLoading ? 
                      <>
                        <SkeltonPost />
                        <SkeltonPost />
                      </>
                      :
                      <>
                      {
                        allPosts && <>
                          {
                            allPosts.length === 0 ? 
                            <span className='zsjdqoc'>
                              No Post Yet
                            </span>
                            :
                            <>
                              {
                                allPosts.map((post, index)=>{
                                  return(
                                    <Post ajusting={"yes"}  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                                  )
                                })
                              }
                            </>
                          }
                        </>
                      }
                      </>
                    }

                  </div>
                </div>

                  

              </>
            }
            </>
          }
        </div>
        <div className="h3">
          <Ads />
          <BirthDays isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
          <Contacts isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
