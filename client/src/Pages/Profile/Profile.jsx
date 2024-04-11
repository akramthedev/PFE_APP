import React, { useState,useRef, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import './index.css';
import '../Home/Home.css';
import Post from '../../Components/Post/Post.jsx';
import axios from 'axios';
import useOutsideAlerter from '../../Helpers/HidePopUp.js'
import Navbar from '../../Components/Navbar/Navbar';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import AdminSymbol from '../../Assets/AdminSymbol.jsx';
import AdserSymbol from '../../Assets/AdserSymbol.jsx';
import CreatePost from '../../Components/CreatePost/CreatePost.jsx';
import { useSocket } from '../../Helpers/SocketContext';
import SkeltonPost2 from '../../Components/Post/SkeltonPost2.jsx';
import SingleContact from '../../Components/SingleContact/SingleContact.jsx';
import { TheOneWhoHasBirthDay } from '../Home/TheOneWhoHasBirthDay.jsx';



const Profile = ({ dataUserCurrent, isFetchingUser, fetchCurrentUser }) => {


  const { id } = useParams();
  const { socket } = useSocket();
  const token = localStorage.getItem('token');
  const idVisited = id;
  const currentId = localStorage.getItem('idUser');
  const popUpRef = useRef(null);
  const popUpRef2 = useRef(null); 
  const popUpRef3 = useRef(null);
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
  const [allPostsWithImages, setallPostsWithImages] = useState([]);
  const [postLoading, setpostLoading] = useState(true);
  const [isImgClicked, setisImgClicked] = useState(false);
  const [imgSrcClicked,setImgSrcClicked] = useState("");
  const [IsModifyProfileClicked,setIsModifyProfileClicked] = useState(false);
  const [IsModifyAboutClicked,setIsModifyAboutClicked] = useState(false);
  const [loaderUpdating,setloaderUpdating] = useState(false);
  const [loaderUpdating2,setloaderUpdating2] = useState(false);

  
  const [isBClicked,setisBClicked] = useState(false);
  const [TheOnesWhoHaveBirthday,setTheOnesWhoHaveBirthday] = useState(null);
  const refref = useRef(null); 
  useOutsideAlerter(refref, setisBClicked);

  const navigate = useNavigate();

  const [modFullname, setModFullname] = useState("");
  const [modPictureProfile, setModPictureProfile] = useState("");
  const [modCoverPicture, setModCoverPicture] = useState("");
  const [modBio, setModBio] = useState("");
  const [modAbout, setModAbout] = useState("");
  const [modAdress, setmodAdress] = useState("");
  const [moddateOfBirth, setmoddateOfBirth] = useState("");
  const [modphoneNumber, setmodphoneNumber] = useState("");
  const [modWebsite, setmodWebsite] = useState("");
  const [ThePostCreated, setThePostCreated] = useState(null);
  const [PostCreated, setPostCreated] = useState(null);
   

  useOutsideAlerter(popUpRef, setpopUp);
  useOutsideAlerter(popUpRef2, setIsModifyProfileClicked);
  useOutsideAlerter(popUpRef3, setIsModifyAboutClicked);



  useEffect(()=>{
    if(PostCreated !== null && ThePostCreated !== null){
      allPosts.unshift(ThePostCreated);
      console.log(ThePostCreated);
    }
  }, [PostCreated]);


  
  const fetchAllPosts = async ()=>{
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
          },100 );
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
    const x = ()=>{
      setisAboutClicked(false);
      setisContactsClicked(false);
      setisGroupsClicked(false);
      setisMediaClicked(false);
      setisPostsClicked(true);
      setallPostsWithImages([]);
    }
    x();
    fetchAllPosts();
  }, [id]);


  const convertToYYYYMMDD = (isoString) => {
    return isoString.split('T')[0];
  };


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      
      try {
        if (token && id) {

            setModFullname("");
            setModPictureProfile("");
            setModCoverPicture("");
            setModBio("");
            setModAbout("");
            setmodphoneNumber(""); 
            setmodAdress("");
            setmoddateOfBirth("");
            setmodWebsite("");

          const response = await axios.get(`http://localhost:3001/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setVisitedUser(response.data);
            
            setModFullname(response.data.fullName);
            setModPictureProfile(response.data.profilePic);
            setModCoverPicture(response.data.coverPic);
            setModBio(response.data.bio);
            setModAbout(response.data.BigAbout);
            setmodphoneNumber(response.data.phoneNumber); 
            setmodAdress(response.data.address);
            if(response.data.dateOfBirth){
              const dateOnlyString = convertToYYYYMMDD(response.data.dateOfBirth);
              setmoddateOfBirth(dateOnlyString);
            }            
            setmodWebsite(response.data.portfolio);
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

 

  useEffect(()=>{
    const x = ()=>{
      if(isPostsClicked){
        fetchAllPosts();
      }
    }
    x();
  }, [isAboutClicked, isContactsClicked, isGroupsClicked, isMediaClicked, isPostsClicked]);


  const handleSubmitUpdatedDocuments = async (e)=>{
    e.preventDefault();
    try{
      if(modFullname.length >= 3 && token){
        setloaderUpdating(true);
        let ProfilP;
        let CoverP;
        if(modCoverPicture === "" || modCoverPicture.length < 20){
          CoverP = "https://live.staticflickr.com/3745/10353673376_ec7a400972_b.jpg"
        }
        else{
          CoverP = modCoverPicture
        }
        if(modPictureProfile === "" || modPictureProfile.length < 20){
          ProfilP = "https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png"
        }
        else{
          ProfilP = modPictureProfile
        }

        const resp = await axios.post('http://localhost:3001/user/updateinfos',{
            idUser      :   currentId,
            fullName    :   modFullname, 
            profilePic  :   ProfilP, 
            coverPic    :   CoverP,
            bio         :   modBio ,
            
            BigAbout    :   modAbout, 
            address     :   modAdress, 
            dateOfBirth :   moddateOfBirth, 
            phoneNumber :   modphoneNumber ,
            portfolio   :   modWebsite,
        }, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          //he sends new data
          setVisitedUser(resp.data);
          setIsModifyProfileClicked(false);

          setModFullname(resp.data.fullName);
          setModPictureProfile(resp.data.profilePic);
          setModCoverPicture(resp.data.coverPic);
          setModBio(resp.data.bio);
          setModAbout(resp.data.BigAbout);
          setmodAdress(resp.data.address);
          if(resp.data.dateOfBirth !== "" && resp.data.dateOfBirth){
            setmoddateOfBirth(convertToYYYYMMDD(resp.data.dateOfBirth));
          }
          else{
            setmoddateOfBirth('');
          }
          setmodphoneNumber(resp.data.phoneNumber);
          setmodWebsite(resp.data.portfolio);
          fetchCurrentUser();
        }
        else{
          setIsModifyProfileClicked(false);
          alert('Oops, something went wrong...');
        }
      }
      else{
        setIsModifyProfileClicked(false);
        alert('Empty Fields...');
      }
    }
    catch(er){
      console.log(er.message);
      alert('Oops, something went wrong...');
    } finally{
      setloaderUpdating(false);
    }
  }



  const updateBigAbout = async(e)=>{
    setloaderUpdating2(true);
    e.preventDefault();
    if( modAbout !== "" ){
      try{
        const resp = await axios.post('http://localhost:3001/user/updateBigAbout',{
          idUser : currentId, 
          BigAbout : modAbout   
        }, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setVisitedUser(resp.data);
          setIsModifyAboutClicked(false);
        }
        else{
          alert('Something went wrong...');
        }
      }
      catch(er){
        alert('Something went wrong...');
        console.log(er.message);
      } finally{
        setloaderUpdating2(false);
      }
    }
  }



  return (
    <div className='Home Profile'>
      <Navbar isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
      
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
      
      <div className={IsModifyProfileClicked ? "imageClickedFixedPosition showimageClickedFixedPosition" : "imageClickedFixedPosition"}>
        <form onSubmit={handleSubmitUpdatedDocuments} ref={popUpRef2} className={IsModifyProfileClicked ? "containerEditProfile showcontainerEditProfile" : "containerEditProfile"}>
          <button
            onClick={()=>{
              setIsModifyProfileClicked(!IsModifyProfileClicked);
            }}
            className=" closePopUpx2 closePopUpx3"
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <div className="About About66 About6688">  
            Edit profile
          </div>
          <div className="About About66">  
            <span>Full Name : </span>  
            <input 
              type="text"
              value={modFullname}
              onChange={(e)=>{
                setModFullname(e.target.value)
              }}
              placeholder='Modify your full name...'
              spellCheck={false}  
            />
          </div>
          <div className="About About66"> 
            <span>Profile Picture : </span> 
            <input 
              type="text"
              value={modPictureProfile}
              onChange={(e)=>{
                setModPictureProfile(e.target.value)
              }}
              placeholder='Modify your profile picture...'
              spellCheck={false}  
            />
          </div>
          <div className="About About66"> 
            <span>Cover Picture : </span> 
            <input 
              type="text"
              value={modCoverPicture}
              onChange={(e)=>{
                setModCoverPicture(e.target.value);
              }}
              placeholder='Modify your cover picture...'
              spellCheck={false}  
            />
          </div>
          <div className="About About66"> 
            <span>Phone Number : </span> 
            <input 
              type="text"
              value={modphoneNumber}
              onChange={(e)=>{
                setmodphoneNumber(e.target.value);
              }}
              placeholder='Modify your phone number...'
              spellCheck={false}  
            />
          </div>
          
          <div className="About About66"> 
            <span>Address : </span> 
            <input 
              type="text"
              value={modAdress}
              onChange={(e)=>{
                setmodAdress(e.target.value)
              }}
              placeholder='Modify your address...'
              spellCheck={false}  
            />
          </div>
          <div className="About About66"> 
            <span>Portfolio : </span> 
            <input 
              type="text"
              value={modWebsite}
              onChange={(e)=>{
                setmodWebsite(e.target.value);
              }}
              placeholder='Modify your portfolio website...'
              spellCheck={false}  
            />
          </div>
          <div className="About About66"> 
            <span>Date Of Birth : </span> 
            <input 
              type="date"
              value={moddateOfBirth}
              onChange={(e)=>{
                setmoddateOfBirth(e.target.value)
              }}
              placeholder='Modify your date of birth...'
              spellCheck={false}  
            />
          </div>
          <div className="About About66 About68 ">
            <span>Bio : </span> 
            <textarea 
              type="text"
              value={modBio}
              onChange={(e)=>{
                setModBio(e.target.value);
              }}
              placeholder='Modify your bio...'
              spellCheck={false}  
            ></textarea>
          </div>

          {/*
          <div className="About About66 About68">
            <span>About : </span> 
            <textarea 
              className='textAreaOfAbout'
              type="text"
              placeholder='Modify your about section...'
              spellCheck={false}  
            ></textarea>
          </div>
          */}

          <div className="About About66 About777">
            <button
              type='submit'
              disabled={loaderUpdating}  
            >
              {
                loaderUpdating ? "Updating your profile..."
                :
                "Saves Changes"
              }
            </button>
          </div>

        </form>
      </div>



      <div className={IsModifyAboutClicked ? "imageClickedFixedPosition  showimageClickedFixedPosition" : "imageClickedFixedPosition"}>
        <form onSubmit={updateBigAbout} ref={popUpRef3} className={IsModifyAboutClicked ? "containerEditProfile containerEditProfile2 showcontainerEditProfile" : "containerEditProfile containerEditProfile2"}>
          <button
            onClick={()=>{
              setIsModifyAboutClicked(!IsModifyAboutClicked);
            }}
            className=" closePopUpx2 closePopUpx3"
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <div className="About About66 About6688">  
            Edit your About section
          </div>
           
            

          <div className="About About66 About68">
            <textarea 
              className='textAreaOfAbout'
              type="text"
              placeholder='Modify your about section...'
              spellCheck={false}
              value={modAbout}
              onChange={(e)=>{
                setModAbout(e.target.value);
              }}  
            ></textarea>
          </div>

          <div className="About About66 About777">
            <button
              type='submit'
              disabled={loaderUpdating}  
            >
              {
                loaderUpdating ? "Updating your profile..."
                :
                "Saves Changes"
              }
            </button>
          </div>

        </form>
      </div>





      <div className="home2">
        <div className="h0">
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
                          setIsModifyProfileClicked(true);
                        }}
                        className="sendrequestFriendShip"
                      >
                        <i className='fa-solid fa-pen'></i>&nbsp;Edit Profile
                      </button>
                    :
                    <>

                      <button 
                        onClick={()=>{
                          handleRequestClicked();
                        }}
                        key={popUp ? 134 : 234}
                        className={requestMade === "contact"?"sendrequestFriendShip addColorRedToRequest" : "sendrequestFriendShip" }
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
                              <><i className='fa-solid fa-user-minus'></i>&nbsp;Remove Contact</>

                            }                         
                          </>
                         }
                        </>
                      }
                      </button>
                      {
                        requestMade === "contact" &&
                        <button 
                          onClick={()=>{
                            navigate(`/discussions`)
                          }}
                          className="messageFriendShip"
                        >
                          <i className='fa-solid fa-message'></i>&nbsp;Message
                        </button>
                      }
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
                      {
                        visitedUser.dateOfBirth && visitedUser.dateOfBirth !== "" && 
                        <div className="About About2">
                          <div className="caseOnA1">
                            <i className='fa-solid fa-cake-candles'></i>
                          </div>
                          <div className="caseOnA2">
                            {
                              convertToYYYYMMDD(visitedUser.dateOfBirth)
                            }
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
                        allPostsWithImages.length !== 0 ? 
                        allPostsWithImages.slice(0, 9).map((image, index) => {
                          return (
                              <img
                                src={image}
                                key={index} // Consider using a more unique identifier for keys if available
                                alt={`${image}-${index}`} // Changed the plus sign to a hyphen for standard alt text formatting
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
                        <span>{allPosts && allPosts.length} Posts</span>
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
                        <span>{(allPosts && allPostsWithImages) && allPostsWithImages.length} Images</span>
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
                        <span>{visitedUser && visitedUser.contacts.length} {visitedUser && visitedUser.contacts.length <=1 ? "Contact" : "Contacts"}</span>
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
                        <span>{visitedUser && visitedUser.groups.length} {visitedUser && visitedUser.groups.length <=1 ? "Group" : "Groups"}</span>
                      </button>
                    </div>

                    
                    

                    {
                      isPostsClicked ? 
                      <>
                          
                          {
                            (dataUserCurrent && (dataUserCurrent._id === id))
                            &&
                            <CreatePost setThePostCreated={setThePostCreated}  PostCreated={PostCreated} setPostCreated={setPostCreated}  reRenderParentCompo={fetchAllPosts}  ajusting="profile" dataUserCurrent={dataUserCurrent} isFetchingUser={isFetchingUser} />
                          }

                          {
                            postLoading ? 
                            <>
                              <SkeltonPost2  />
                              <SkeltonPost2  />
                            </>
                            :
                            <>
                            {
                              allPosts && <>
                                {
                                  allPosts.length === 0 ? 
                                  <span className='zsjdqoczsjdqoc'>
                                    No Post Yet
                                  </span>
                                  :
                                  <>
                                    {
                                      allPosts.map((post, index)=>{
                                        return(
                                          <Post reRenderParentCompo={fetchAllPosts} ajusting={"yes"}  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                                        )
                                      })
                                    }
                                  </>
                                }
                              </>
                            }
                            </>
                          }

                      </> : 
                      isAboutClicked ? 
                      <div className='AboutClickedContainer'>
                        {
                          id === currentId && 
                          <div 
                            onClick={
                              ()=>{
                                setIsModifyAboutClicked(true);
                              }
                            }
                            className="createAboutSection">
                          {
                            visitedUser && (visitedUser.BigAbout && visitedUser.BigAbout !== "") ?
                            "Edit your about section"
                            :
                            "Create an about section" 
                          }
                          </div>
                        }
                        {
                          (visitedUser && (!visitedUser.BigAbout || visitedUser.BigAbout === '' || visitedUser.BigAbout === " " )) ?
                          <span className='zsjdqoczsjdqoc'>
                            No About section was written yet
                          </span>
                          :
                          <>                          
                            <div className="Aboutx88">
                              <h1>About</h1>
                            </div>
                            <div className="Aboutx88 Aboutx88Aboutx88">
                            {
                              (visitedUser && visitedUser.BigAbout )&&
                              visitedUser.BigAbout.split('\n').map((line, index) => (
                                <>
                                {line}
                                <br />
                                </>
                              ))
                            }
                            </div>
                          </>

                        }
                      </div> : 
                      isMediaClicked ?
                        <div className='mediaContainer'>
                          {
                              (allPosts && allPostsWithImages) && <>
                                {
                                  allPostsWithImages.length === 0 ? 
                                  <span className='zsjdqoc'>
                                    No Media Yet
                                  </span>
                                  :
                                  <>
                                    {
                                      allPostsWithImages.map((image, index)=>{
                                        return(
                                          <img
                                            onClick={()=>{
                                              setisImgClicked(true);
                                              setImgSrcClicked(image)
                                            }}
                                            key={index}
                                            src={image}
                                            alt='image'
                                          />
                                        )
                                      })
                                    }
                                  </>
                                }
                              </>
                            }
                      </div> : 
                      isContactsClicked ? 
                      <>
                      {
                        visitedUser.contacts.length === 0 ? 
                        <span className='zsjdqoczsjdqoc'>
                          No contacts yet..
                        </span>
                        :
                        <div className='contactsContainer'>
                        {
                          visitedUser.contacts.map((contact, index)=>{
                            return(
                              <SingleContact contact={contact}  />
                            )
                          })
                        }
                        </div>
                      }
                      </> :
                      isGroupsClicked &&
                      <>
                        Groups Clicked
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
          <BirthDays setisBClicked={setisBClicked} setTheOnesWhoHaveBirthday={setTheOnesWhoHaveBirthday } isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
          <Contacts isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} />
        </div>
      </div>
      
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


      </div>
  );
};

export default Profile;
