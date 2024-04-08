import React, {useState, useEffect, useRef} from 'react'
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';
import CreatePost from '../../Components/CreatePost/CreatePost';
import Post from '../../Components/Post/Post';
import PostAds from '../../Components/Post/PostAds';
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";
import PostSuggestedUsers from '../../Components/Post/PostSuggestedUsers';
import OpenerMp3 from '../../MP3Sounds/openingAuth.wav';
import SkeltonPost from '../../Components/Post/SkeltonPost';
import '../Profile/index.css'
import HidePopUp from '../../Helpers/HidePopUp';
import Step1 from './step1.png';
import Step2 from './step2.png';
import Step3 from './step3.png';
import Step4 from './step4.png';
import {useNavigate} from 'react-router-dom'



const Home = ({ isFetchingUser, dataUserCurrent, ResponseRequest, renderUser}) => {


    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const [allPosts, setAllPosts] = useState([]);
    const [postLoading, setpostLoading] = useState(true);
    const popUpRef2 = useRef(null);
    const [isCreatedPageCLicked, setisCreatedPageCLicked] = useState(false);
    //new page creating states
    const [name, setName]=useState(""); //step = 1
    const [description, setdescription]=useState(""); //step = 2
    const [isForAdults, setisForAdults]=useState(null); //step = 3
    const [website, setwebsite]=useState(""); //step = 4 ! not important can be skiped 
    const [step, setStep]=useState(1);
    const [loader, setLoader]=useState(false);



    HidePopUp(popUpRef2,setisCreatedPageCLicked );

    const fetchAllPosts = async ()=>{
      try{
        setpostLoading(true);
        const resp = await axios.get('http://localhost:3001/post/');
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
    }, []);

    
  
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
          setTimeout(()=>{
            navigate(`/page/${resp.data._id}`);
          }, 500);
        }
        else{
          alert('Oops, something went wrong!');
        }
      }
      catch(er){
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
              <UtilsAndNavigations setisCreatedPageCLicked={setisCreatedPageCLicked}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <CreatePost reRenderParentCompo={fetchAllPosts}  ajusting="home" isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
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
                      <span className='zsjdqoczsjdqoc'>
                        Be the pioneer and make the first post on the platform!
                      </span>
                      :
                      <>
                        {
                          allPosts.map((post, index)=>{
                            return(
                              <Post reRenderParentCompo={fetchAllPosts} ajusting={"no"}  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                            )
                          })
                        }
                        <PostAds />
                        <PostSuggestedUsers  />
                      </>
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
  )
}

export default Home