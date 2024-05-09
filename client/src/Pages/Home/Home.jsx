import React, {useState, useEffect, useRef} from 'react'
import '../../Components/BirthDays/BirthDays.css';
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';
import CreatePost from '../../Components/CreatePost/CreatePost';
import Post from '../../Components/Post/Post';
import PagePost from '../../Components/Post/PagePost';
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";
import PostSuggestedUsers from '../../Components/Post/PostSuggestedUsers';
import SkeltonPost from '../../Components/Post/SkeltonPost';
import '../Profile/index.css'
import HidePopUp from '../../Helpers/HidePopUp';
import Step1 from './step1.png';
import Step2 from './step2.png';
import Step3 from './step3.png';
import Step4 from './step4.png';
import {useNavigate} from 'react-router-dom'
import { TheOneWhoHasBirthDay } from './TheOneWhoHasBirthDay';



const Home = ({ dataAds, isFetchingUser, dataUserCurrent, ResponseRequest, renderUser}) => {


    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const [allPosts, setAllPosts] = useState([]);
    const [postLoading, setpostLoading] = useState(true);
    const popUpRef2 = useRef(null);
    const [PostCreated, setPostCreated] = useState(null);
    const [ThePostCreated, setThePostCreated] = useState(null);
    const [isCreatedPageCLicked, setisCreatedPageCLicked] = useState(false);
    //new page creating states
    const [name, setName]=useState(""); //step = 1
    const [description, setdescription]=useState(""); //step = 2
    const [isForAdults, setisForAdults]=useState(null); //step = 3
    const [website, setwebsite]=useState(""); //step = 4 ! not important can be skiped 
    const [step, setStep]=useState(1);
    const [loader, setLoader]=useState(false);
    const [loaderAnnonce, setloaderAnnonce]=useState(true);
    
    const [isBClicked,setisBClicked] = useState(false);
    const [TheOnesWhoHaveBirthday,setTheOnesWhoHaveBirthday] = useState(null);
    const [suggestedUsers, setsuggestedUsers] = useState(null);
    const [loaderSuggested, setloaderSuggested] = useState(true);
    const refref = useRef(null); 
    const [annonce, setannonce] = useState(null);
    HidePopUp(popUpRef2,setisCreatedPageCLicked );
    HidePopUp(refref, setisBClicked);

    useEffect(() => {
      if (PostCreated !== null && ThePostCreated !== null) {
        // Create a new array with the newly created post at the beginning
        const updatedPosts = [ThePostCreated, ...allPosts];
        // Update the state with the new array
        setAllPosts(updatedPosts);
        console.log(ThePostCreated);
      }
    }, [PostCreated, ThePostCreated]);
    


    useEffect(()=>{
      console.log("Post Added successfully!")
    }, [allPosts]);

    const fetchAllPosts = async ()=>{
      try{
        if(allPosts.length === 0){
          setpostLoading(true);
          setloaderSuggested(true);
        }
        const resp = await axios.get('http://localhost:3001/post/', {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          
          const resp2 = await axios.get(`http://localhost:3001/graph/suggested-contacts/${idUser}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp2.status === 200){
            setsuggestedUsers(resp2.data);
          }
          else{
            setsuggestedUsers([]);
          }
          setAllPosts(resp.data);
        }
        else{
          setAllPosts([]);
          setsuggestedUsers([]);
        }
      }
      catch(e){
        setAllPosts([]);
        setsuggestedUsers([]);
        console.log(e.message);
      } finally{
        setpostLoading(false);
      }
    }


    const fetchAllPostWithLoading = async()=>{
      try{
        setpostLoading(true);
        setloaderSuggested(true);
        const resp = await axios.get('http://localhost:3001/post/', {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          
          const resp2 = await axios.get(`http://localhost:3001/graph/suggested-contacts/${idUser}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp2.status === 200){
            setsuggestedUsers(resp2.data);
          }
          else{
            setsuggestedUsers([]);
          }
          setAllPosts(resp.data);
        }
        else{
          setAllPosts([]);
          setsuggestedUsers([]);
        }
      }
      catch(e){
        setAllPosts([]);
        setsuggestedUsers([]);
        console.log(e.message);
      } finally{
        setpostLoading(false);
      }
    }
    

    const getAnnoucement = async ()=>{
      try{
        if(token){
          const resp = await axios.get('http://localhost:3001/annoucement', {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
              console.log(resp.data)
            if(resp.data.length >= 1){
              setannonce(resp.data[0]);
            }
          }
          setTimeout(()=>{
            setloaderAnnonce(false);
          }, 250);
        }
      }
      catch(e){
        console.log(e.message);
        setloaderAnnonce(false);
      }
    }
  
    useEffect(()=>{
      fetchAllPosts();
     }, [PostCreated]);

     useEffect(()=>{
      getAnnoucement();
     }, [token]);


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

  const [SuccessCreatingPage,setSuccessCreatingPage] = useState(false);
  const [idPageCreated,setidPageCreated] = useState("");

  const handleCreateNewPage = async()=>{
    if(name.length> 5 && description.length> 10){
      setLoader(true);
      try{
        const resp = await axios.post("http://localhost:3001/page/create", {
          name : name, 
          description : description, 
          isForAdults : isForAdults, 
          website : website,
          creator : idUser
        }, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setisCreatedPageCLicked(false);
          renderUser();
          setidPageCreated(resp.data._id);
          setSuccessCreatingPage(true);
        }
        else{
          setSuccessCreatingPage(false);
          setisCreatedPageCLicked(false);
          alert('Oops, something went wrong!');
        }
      }
      catch(er){
        setisCreatedPageCLicked(false);
        setSuccessCreatingPage(false)
        console.log(er.message);
      } finally{
        setLoader(false);
      }
    }
  }

  return (
    <div className='Home'>
      

        <div className={isCreatedPageCLicked ? "imageClickedFixedPosition showimageClickedFixedPosition" : "imageClickedFixedPosition"}>
          <div   ref={popUpRef2} className={isCreatedPageCLicked ? "containerEditProfile containerEditProfile2 showcontainerEditProfile" : "containerEditProfile containerEditProfile2"}>
            <button
              type='button'
              onClick={()=>{
                setisCreatedPageCLicked(!isCreatedPageCLicked);
              }}
              className=" closePopUpx2 closePopUpx3 closePopUpx3closePopUpx3"
            >
              <i className='fa-solid fa-xmark'></i>
            </button>


            <div className="containerXZE">
              <div className="jqfd">
                
                {
                  step === 1 ? 
                  <img 
                  className='zjhoqdc'
                    src={Step1} 
                    alt=""
                  />
                  :
                  step === 2 ? 
                  <img 
                  className='zjhoqdc'
                    src={Step2}
                    alt=""
                  />
                  :
                  step === 3 ? 
                  <img 
                  className='zjhoqdc'
                    src={Step3}
                    alt=""
                  />
                  :
                  step === 4 &&
                  <img 
                  className='zjhoqdc'
                    src={Step4}
                    alt=""
                  />
                   
                }
              </div>
              <div className="jqfd">
              {
                step === 1 ? 
                <>
                  <div className="titleXXXX">
                  Let's Baptize Your Blank Page with a Fitting Title!
                  </div>
                  <div className="rowConYinp">
                    <input 
                      value={name}
                      type="text"
                      onChange={(e)=>{
                        setName(e.target.value)
                      }}
                      spellCheck={false}
                      placeholder='Enter your page a name...'
                    />
                  </div>
                </>
                :
                step === 2 ? 
                <>
                  <div className="titleXXXX">
                  Now, let's craft a descriptive label for your pristine page!
                  </div>
                  <div className="rowConYinp">
                    <input 
                      value={description}
                      type="text"
                      onChange={(e)=>{
                        setdescription(e.target.value)
                      }}
                      spellCheck={false}
                      placeholder='Enter your page description...'
                    />
                  </div>
                </>
                :
                step === 4 ? 
                <>
                  <div className="titleXXXX">
                    Please select yes, if your content is intended for adults...
                 </div>
                  <div className="rowConYinp">
                    <span 
                      onClick={()=>{
                        setisForAdults(true)
                      }}
                    className={((isForAdults !== null) && isForAdults === true) ? "suo yesyes" : "suo"}>
                      Yes
                    </span>
                    <span
                      onClick={()=>{
                        setisForAdults(false)
                      }}
                    className={((isForAdults !== null) && isForAdults === false) ? "suo nono" : "suo"}>
                      No
                    </span>
                  </div>
                  <br />

                </>
                :
                 
                step === 3 &&
                <>
                  <div className="titleXXXX">
                  If you have a website, please feel free to share the link for reference...
                  </div>
                  <div className="rowConYinp">
                    <input 
                      value={website}
                      type="text"
                      onChange={(e)=>{
                        setwebsite(e.target.value)
                      }}
                      spellCheck={false}
                      placeholder='Enter your page website...'
                    />
                  </div>
                </>

              }
                <div className="rowConYinp">
                    
                      <button
                      className={step===4?"submitBtnbbb":"notSubmiutibtn"}
                      onClick={()=>{
                        if(step === 1){
                          if(name.length >= 5){
                            setStep(step + 1);
                          }
                        }
                        else if(step === 2){
                          if(description.length >= 10){
                            setStep(step + 1);
                          }
                        }
                        else if(step === 3){
                          setStep(step + 1);
                        }
                        else if(step === 4){
                          if(isForAdults !== null){
                            handleCreateNewPage();
                          }
                        }
                        else{
                          setisCreatedPageCLicked(false);
                          setTimeout(()=>{
                            setName('');
                            setStep(1);
                            setdescription('');
                            setisForAdults(null)
                            setwebsite('');
                          }, 500 );
                        }
                      }}
                      type={step===4?"submit":"button"}
                    >
                    {
                      step === 4 ? 
                      <>
                      {
                        loader ? 
                        <>
                          Creating
                        </>
                        :
                        <>
                          Lunch The Page!
                        </>
                      }
                      </>
                       
                      :
                      "Next Step"
                    }
                    </button>

                </div>

              
              </div>
            </div>
            

          </div>
        </div>
          

          <Navbar  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent}  />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations isCreatedPageCLicked={isCreatedPageCLicked}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} setisCreatedPageCLicked={setisCreatedPageCLicked}  />
            </div>
            <div className="h2">
              <CreatePost setThePostCreated={setThePostCreated} PostCreated={PostCreated} setPostCreated={setPostCreated} reRenderParentCompo={fetchAllPosts}  ajusting="home" isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              {
                (postLoading && loaderSuggested) ? 
                <>
                  <SkeltonPost />
                  <SkeltonPost />
                  <SkeltonPost />
                  <SkeltonPost />
                </>
                :
                <>
                {
                  (allPosts && suggestedUsers ) && <>
                    {

                      allPosts.length === 0 ? 
                      <span className='zsjdqoczsjdqoc'>
                        Be the pioneer and make the first post on the platform!
                      </span>
                      :
                      <>
                      {
                                      !loaderAnnonce && 
                                      <div class="zuoefuoqeofyoqeo">
                                          <div class="background"></div>
                                          <div class="content">
                                          {
                                            annonce && 
                                            annonce.annoucementX.split('\n').map((line, index) => (
                                              <>
                                              {line}
                                              <br />
                                              </>
                                            ))
                                          }
                                          </div>
                                      </div>
                                        
                                    }
                        {
                          allPosts.map((post, index)=>{
                            if(index === 2 && allPosts.length > 3){
                                if(post.isPagePost){
                                  return(
                                    <>
                                      
                                      {
                                        suggestedUsers.length !== 0 && 
                                        <PostSuggestedUsers suggestedUsers={suggestedUsers}  />
                                      }
                                      <PagePost   reRenderParentCompo={fetchAllPostWithLoading} ajusting={"no"}  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                                    </>
                                  )
                                 }
                                 else{
                                  return(
                                    <>
                                       
                                      {
                                         suggestedUsers.length !== 0 && 
                                        <PostSuggestedUsers suggestedUsers={suggestedUsers}  />
                                      }
                                      <Post reRenderParentCompo2={fetchAllPostWithLoading} state={ThePostCreated} state2={PostCreated} reRenderParentCompo={fetchAllPosts} ajusting={"no"}  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                                    </>
                                  )
                                 }
                            }
                            else{
                              
                              if(post.isPagePost){
                                return(
                                  <>
                                  
                                     
                                      
                                    <PagePost state3={allPosts} reRenderParentCompo={fetchAllPostWithLoading} ajusting={"no"}  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                                  </>
                                )
                               }
                              else{
                                return(
                                  <>
                                     
                                    <Post reRenderParentCompo2={fetchAllPostWithLoading}  state3={allPosts} state={ThePostCreated} state2={PostCreated} reRenderParentCompo={fetchAllPosts} ajusting={"no"}  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                                  </>
                                )
                              }

                            }
                          })
                        }
                      </>
                    }
                  </>
                }
                </>
              } 
              {
                (allPosts && allPosts.length <= 3) &&    
                <>
                  {
                     suggestedUsers && suggestedUsers.length !== 0 && 
                    <PostSuggestedUsers suggestedUsers={suggestedUsers}  />
                  }
                </>
              }
            </div>
            <div className="h3">
            {
              !isFetchingUser && dataUserCurrent
              &&
              <>
                <Ads dataAds={dataAds} />
                <BirthDays setTheOnesWhoHaveBirthday={setTheOnesWhoHaveBirthday} setisBClicked={setisBClicked}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
                <Contacts    isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}   />
              </>
            }
            </div>
          </div>
          <div className={isBClicked ? "isBClicked showisBClicked" : "isBClicked"}>
            <div  ref={refref} className={isBClicked ? "isContainerB showisContainerB" : "isContainerB"}>
            
            <div className="rowzodjq">
              Wish a Happy Birthday!
            </div>
            {
              TheOnesWhoHaveBirthday && 
              TheOnesWhoHaveBirthday.length !== 0 && 
              TheOnesWhoHaveBirthday.map((one, index)=>{
                return(
                  <TheOneWhoHasBirthDay one={one} dataUserCurrent={dataUserCurrent} />
                )
              })
            }
            </div>
          </div>
    </div>
  )
}

export default Home