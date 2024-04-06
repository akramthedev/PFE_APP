import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import './index.css';
import '../Home/Home.css';
import AdminSymbol from '../../Assets/AdminSymbol.jsx';
import AdserSymbol from '../../Assets/AdserSymbol.jsx';
import CreatePost from '../../Components/CreatePost/CreatePost.jsx';




const Profile = ({ dataUserCurrent, isFetchingUser }) => {


  const { id } = useParams();
  const token = localStorage.getItem('token');
  const idVisited = id;
  const currentId = dataUserCurrent?._id;

  const [loading, setLoading] = useState(true);
  const [visitedUser, setVisitedUser] = useState(null);
  const [isPostsClicked, setisPostsClicked] = useState(true);
  const [requestMade, setrequestMade] = useState(null);
 

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (token && id) {

          //see if the id is in the requests data
          if(id !== currentId){
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
                setrequestMade("youAreTheSender");
              }
              else{
                setrequestMade("heIsTheSender");
              }
            }
            else{
              setrequestMade("none");
            }
          }

          const response = await axios.get(`http://localhost:3001/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setVisitedUser(response.data);
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

   

  const handleRequestClicked = async ()=>{

    try{

    }
    catch(e){
      console.log(e.message);
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
                      <button 
                        onClick={()=>{
                          handleRequestClicked();
                        }}
                        className="sendrequestFriendShip"
                      >
                      { requestMade && 
                      <>
                        {
                          requestMade === "none" ? 
                          <><i className='fa-solid fa-user-plus'></i>&nbsp;Add Contact</>
                          : requestMade === "youAreTheSender" ? 
                          <><i className='fa-solid fa-check'></i>&nbsp;Request Sent</>
                          : requestMade === "heIsTheSender" && 
                          <><i className='fa-solid fa-check'></i>&nbsp;Request Received</>

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
