import React, { useState,useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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




const Profile = ({ dataUserCurrent, isFetchingUser, fetchCurrentUser }) => {


  const { id } = useParams();
  const token = localStorage.getItem('token');
  const idVisited = id;
  const currentId = localStorage.getItem('idUser');
  const popUpRef = useRef(null); 
  const [loading, setLoading] = useState(true);
  const [visitedUser, setVisitedUser] = useState(null);
  const [isPostsClicked, setisPostsClicked] = useState(true);
  const [requestMade, setrequestMade] = useState(null);
  const [popUp, setpopUp] = useState(false);
 
  useOutsideAlerter(popUpRef, setpopUp);

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
                      <div ref={popUpRef} className={popUp ? "popUp showpopUp" : "popUp"}>
                          <button
                            onClick={()=>{
                              setpopUp(!popUp);
                            }}
                            className="closePopUp2"
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

                    </div>
                    <div className="Photos">

                    </div>
                  </div>
                  <div className="OthersAndCreatePostAndPosts">

                    <div className="navabarOfProfile">
                      <button
                        className={isPostsClicked && "AddColorBlueviolet"}
                      >
                        <i className='fa-solid fa-list'></i>
                        <span>Posts</span>
                      </button>
                      <button>
                        <i className='fa-solid fa-image'></i>
                        <span>Images</span>
                      </button>
                      <button>
                        <i className='fa-solid fa-address-card'></i>
                        <span>About</span>
                      </button>
                      <button>
                        <i className='fa-solid fa-user-group'></i>
                        <span>Contacts</span>
                      </button>
                      <button>
                        <i className='fa-solid fa-people-group'></i>
                        <span>Groups</span>
                      </button>
                    </div>

                    {
                      (dataUserCurrent && (dataUserCurrent._id === id))
                      &&
                      <CreatePost ajusting="profile" dataUserCurrent={dataUserCurrent} isFetchingUser={isFetchingUser} />
                    }

                    {

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
