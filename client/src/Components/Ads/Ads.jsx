import React, {useRef, useState, useEffect} from 'react'
import './Ads.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import OutsidePopUp from '../../Helpers/HidePopUp';
import Step1 from './step1.avif';
import Step2 from './step2.avif';
import Step3 from './step3.avif';
import Step4 from './step4.avif';
import '../../Pages/Home/Home.css'




const Ads = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [data, setData] = useState(null);
    const [isCreatedAdClicked, setisCreatedAdClicked] = useState(false);
    const [applicationAlreadySent, setapplicationAlreadySent] = useState(null);
    const popUpRef2 = useRef(null);


    const [name, setName]=useState(""); //step = 1
    const [description, setdescription]=useState(""); //step = 2
    const [isForAdults, setisForAdults]=useState(false); //step = 3
    const [website, setwebsite]=useState(""); //step = 4 ! not important can be skiped 
    const [application, setapplication]=useState(null); //step = 4 ! not important can be skiped 
    const [step, setStep]=useState(1);
    const [loader, setLoader]=useState(false);


    OutsidePopUp(popUpRef2, setisCreatedAdClicked);    

    const fetchUser = async ()=>{
        if(idUser && token){
        try{
            const resp = await axios.get(`http://localhost:3001/user/${idUser}`, {
              headers : {
                  Authorization : `Bearer ${token}`
              }
            });
            if(resp.status === 200){
                setData(null);
                console.log(resp.data);
                setData(resp.data);
            }
            else{
              setData(null);
            }

            const resp2 = await axios.get(`http://localhost:3001/ads/check/${idUser}`, {
              headers : {
                  Authorization : `Bearer ${token}`
              }
            });
            if(resp2.status === 200){
              setapplication(resp2.data);
              setapplicationAlreadySent(true);
            }
            else{
              setapplicationAlreadySent(false);
            }
        }
        catch(e){
          setData(null);
          console.log(e.message);
        } finally{
            setIsFetchingUser(false);
        }
        }
    }


    
    useEffect(()=>{
        fetchUser();
    }, []);


    const handleSendRequest = async ()=>{
        try {

          if(name.length >= 5 && description.length >= 10 ){
            
              let data = {
                applicant   : idUser,
                companyName : name, 
                companyDesc : description, 
                companySite : website, 
                isForAdults : isForAdults
              }

              const resp = await axios.post('http://localhost:3001/ads/send-request', data, {
                headers : {
                  Authorization : `Bearer ${token}`
                }
              });

              if(resp.data){
                setTimeout(()=>{
                  setisCreatedAdClicked(false);
                  fetchUser();
                }, 100);
                setwebsite("");
                setName("")
                setdescription("");
                setStep(1);
                setTimeout(()=>{
                  let id = document.getElementById('id');
                  id.click();
                }, 1500);
              }
              else{
                setisCreatedAdClicked(false);
                alert('Oops, something went wrong!');
              }
          }
        } catch (error) {
            setisCreatedAdClicked(false);
            alert('Internal Server Error');
            console.log(error.message);
        }
    }


    const [loaderDelete,setloaderDelete ] = useState(false);

    const handleDeleteApplication = async ()=>{
      setloaderDelete(true);
      try{
        const resp = await axios.delete(`http://localhost:3001/ads/${application._id}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp){
          setisCreatedAdClicked(false);
          fetchUser();
        }
      }
      catch(e){
        console.log(e.message);
      } finally{
        setloaderDelete(false);
      }
    }

  return (
    <>

        <div className={isCreatedAdClicked ? "imageClickedFixedPosition showimageClickedFixedPosition" : "imageClickedFixedPosition"}>
          <div   ref={popUpRef2} className={isCreatedAdClicked ? "containerEditProfile containerEditProfile2 showcontainerEditProfile containerEditProfile33" : "containerEditProfile33 containerEditProfile containerEditProfile2"}>
            <button
              type='button'
              onClick={()=>{
                setisCreatedAdClicked(!isCreatedAdClicked);
              }}
              className=" closePopUpx2 closePopUpx3 closePopUpx3closePopUpx3"
            >
              <i className='fa-solid fa-xmark'></i>
            </button>


            {
              applicationAlreadySent !== null &&
              <>
              { 
                !applicationAlreadySent ? 
                <>
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
                        Please provide the name of your organization.
                        </div>
                        <div className="rowConYinp">
                          <input 
                            value={name}
                            type="text"
                            onChange={(e)=>{
                              setName(e.target.value)
                            }}
                            spellCheck={false}
                            placeholder='Enter the name of your company...'
                          />
                        </div>
                      </>
                      :
                      step === 2 ? 
                      <>
                        <div className="titleXXXX">
                          Please furnish us with details pertaining to your organization.
                        </div>
                        <div className="rowConYinp">
                          <input 
                            value={description}
                            type="text"
                            maxLength={50}
                            onChange={(e)=>{
                              setdescription(e.target.value)
                            }}
                            spellCheck={false}
                            placeholder='Enter your description...'
                          />
                        </div>
                      </>
                      :
                      step === 4 ? 
                      <>
                        <div className="titleXXXX">
                          Kindly indicate "yes" if the content of your company is intended for adults.
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
                        If your organization possess a website, please feel free to share the link...
                        </div>
                        <div className="rowConYinp">
                          <input 
                            value={website}
                            type="text"
                            onChange={(e)=>{
                              setwebsite(e.target.value)
                            }}
                            spellCheck={false}
                            placeholder='Enter your company website...'
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
                                handleSendRequest();
                                
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
                                Send Application
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
                </>
                :
                <div className='ApplicationAlreadySubmited'>
                <h3>
                  Application already Submited 
                </h3>
                <span className='zquhdç'>You'll receive the response within 24 hours</span>
                {
                  application && 
                  <>
                  <div className="jackkk">
                  <span>Company Name</span> <span>{application.companyName}</span>
                  </div>
                  <br />
                  <div className="jackkk">
                    <span>Company Website</span>  <span>{application.companySite}</span>
                  </div>
                  <br />
                  <div className="jackkk">
                  <span>Company Description</span>  <span>{application.companyDesc}</span>
                  </div>
                  <br />
                  <div className="jackkk">
                  <span>Age Categorie</span> <span>{application.isForAdults ? "Adults" : "All ages"}</span>
                  </div>
                  
                  <br />
                  <div className="jackkk">
                    <button
                      className='deleteApplication'
                      onClick={handleDeleteApplication}
                    >
                    {
                      loaderDelete ? "Deleting the application..."
                      :
                      "Delete Application"
                    }
                    </button>
                  </div>
                  </>
                }
                </div> 
              }
              </>
              
            }
            

          </div>
        </div>

    <div className='Ads'>
        <div className="sponsored">  
            Sponsored     
            {
                (data && !isFetchingUser  && (applicationAlreadySent !== null) )&& 
                <span 
                    id='id'
                    onClick={()=>{
                      setisCreatedAdClicked(true);
                    }}
                    className="createYourAds"
                >
                {
                    data.role === "user" && "Create Ad"
                }
                </span> 
            }
        </div>
        <div className="rowAds"
            onClick={()=>{
                navigate("/ads/666");
            }}
        >
            <img 
                className='pictureAds'
                src='https://media.istockphoto.com/id/1020968912/fr/vectoriel/ic%C3%B4ne-de-feuille-d%C3%A9rable-symbole-canadien-illustration-vectorielle.jpg?s=612x612&w=0&k=20&c=L5NAEshTBfIk9_QjmTfT0qDoIlH6tQEg0NRNQTvFBsM='
                alt=""
            />
            <span className='jackijack'>
                <span className="titleOftheAd">
                    WORK IN CANADA
                </span>
                <span className="shortDescripton">
                    job.workincancada.om
                </span>
            </span>
        </div>
        <div className="rowAds"
              onClick={()=>{
                navigate("/ads/666");
              }}
        >
            <img 
                className='pictureAds'
                src = "https://i1.sndcdn.com/artworks-wIyqUD3yoZHgsnVm-K3Ozvg-t500x500.jpg"
                alt=""
            />
            <span className='jackijack'>
                <span className="titleOftheAd">
                    ACCELERATE YOUR CAREER
                </span>
                <span className="shortDescripton">
                    jobintechagency.org
                </span>
            </span>
        </div>
        
    </div>
    </>
  )
}

export default Ads