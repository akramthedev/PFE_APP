import React, { useEffect, useState } from 'react'
import {useNavigate , useParams} from 'react-router-dom'
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import LoaderSvg from '../../Assets/spinwhite.svg';
import SingleAds from './SingleAds';


const AdserPanel2 = ({isFetchingUser, dataUserCurrent, fetchCurrentUser}) => {

    const nav = useNavigate();
    const idUser = localStorage.getItem('idUser');
    const { token} = useParams();
    const [planOfUser, setplanOfUser] = useState(null);
    const [maxAdsToCreated, setmaxAdsToCreated] = useState(null);


    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [image, setimage] = useState("");
    const [loader, setloader] = useState(false);
    const [loader2, setloader2] = useState(true);
    const [allAds, setallAds] = useState(null);
    const [Impossible,setImpossible] = useState(false);
    const navigate = useNavigate();
    


    useEffect(()=>{
      const x = async ()=>{
        
        if(token){
            
          try{
            const resp = await axios.get(`http://localhost:3001/ads/getPlanOfUserWithToken/${idUser}`, {
              headers : {
                Authorization : `Bearer ${token}`
              }
            });
            if(resp.status === 200){
              if(resp.data.plan === 0){
                navigate('/adser/panel');
              }
              else{
                setplanOfUser(resp.data.plan);
                if(parseInt(resp.data.plan) === 1){
                  setmaxAdsToCreated(3);
                }
                else if(parseInt(resp.data.plan) === 2){
                  setmaxAdsToCreated(5);
                }
                else if(parseInt(resp.data.plan) === 3){
                  setmaxAdsToCreated(7);
                }
              }
            } 
            else{
            alert('Error.......');
            }
          }
          catch(e){
          alert('Error.......');
            console.log(e.message);
          }
        
        }

      }
      x();
    }, [token]);


    const handlFetchAllAds = async()=>{
      setloader2(true);
      try {
        const resp = await axios.get(`http://localhost:3001/ads/getAllAdsCreatedByUser/${idUser}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setallAds(resp.data);

        }
        else{
          setallAds([]); 
        }
      }
      catch(er){
        setallAds([]); 
        console.log(er.message);
      } finally{
        setloader2(false);
      }
    }

    useEffect(()=>{
      handlFetchAllAds();
    }, []);


    const handlCreate = async(e)=>{
      e.preventDefault();
      if(token &&  title.length >= 10 && description.length >= 20 && image.length >= 14){
        setloader(true);
        try {
          const resp = await axios.post('http://localhost:3001/ads/createSingleAds/', {
            idUser : idUser, 
            title : title, 
            description : description, 
            image : image,
          }, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            settitle("");
            setdescription("");
            setimage("");
            handlFetchAllAds();
          }
          else{
            setImpossible(true);
          }
        }
        catch(er){
          alert('Internal Server Error.')
          console.log(er.message);
        } finally{
          setloader(false);
        }
      }
    }



    return (
    <div className='Home22'>

        { planOfUser !== null && maxAdsToCreated !== null ?
        <div className="home2888 oqd779">
          
          <Navbar  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent}  />
          
          

          <div className="containerFlexingh">

              
              <div className='oqdconqsoc'> 
                
                <div className="headerxjs">
                    <h1>
                    <>Plan : {planOfUser && <>{planOfUser === 1 ? "Basic" : planOfUser === 2 ? "Standard" : planOfUser === 3 && "Premium" }</>}
                    {
                      planOfUser && <>
                        {
                          planOfUser === 1 ? <>&nbsp;<i className='fa-solid fa-star'></i></>
                          :
                          planOfUser === 2 ? <>
                            &nbsp;<i className='fa-solid fa-star'></i>&nbsp;<i className='fa-solid fa-star'></i>
                          </>
                          :
                          <>
                            &nbsp;<i className='fa-solid fa-star'></i>&nbsp;<i className='fa-solid fa-star'></i>&nbsp;<i className='fa-solid fa-star'></i>
                          </>
                        }
                      </>
                    }
                    </>
                    </h1>
                    <div className="uoqefds">
                      <span>
                        Total Ads : {(allAds )&&  (allAds.length)  }
                      </span>                    
                      <span>
                        Max Ads : {maxAdsToCreated && maxAdsToCreated}
                      </span>
                    </div>
                </div>

                {
                  allAds && maxAdsToCreated && 
                  <>
                  {
                     
                    <form className='zuqdc' onSubmit={handlCreate}>
                        {
                          maxAdsToCreated === allAds.length ? 
                          <div className="createnewadfg youHaveReachedMax">
                            You have reached the limit. Upgrade your plan!
                          </div>
                          :
                          <div className="createnewadfg">
                            Create a new Ad
                          </div>
                        }
                        <input
                          value={title} 
                          type="text"
                          disabled={maxAdsToCreated === allAds.length}
                          spellCheck={false}
                          className={maxAdsToCreated === allAds.length && "noCursorallowed noCursorallowed2"}
                          onChange={(e)=>{
                            settitle(e.target.value);
                          }}
                          placeholder='Enter the title of your ads...'
                        />
                        
                        <input
                          value={description} 
                          type="text"
                          className={maxAdsToCreated === allAds.length && "noCursorallowed noCursorallowed2"}
                          disabled={maxAdsToCreated === allAds.length}
                          spellCheck={false}
                          onChange={(e)=>{
                            setdescription(e.target.value);
                          }}
                          placeholder='Enter the description of your ads...'
                        />
                        
                        <input
                          value={image} 
                          type="text"
                          className={maxAdsToCreated === allAds.length && "noCursorallowed noCursorallowed2"}
                          disabled={maxAdsToCreated === allAds.length}
                          spellCheck={false}
                          onChange={(e)=>{
                            setimage(e.target.value);
                          }}
                          placeholder='Enter the image of your ads...'
                        />
                        
                        <button
                          type="submit"
                          disabled={loader}
                          className={image.length < 15 && description.length <10 && title < 6 && 'noCursorallowed'}
                        >
                        {
                          loader ? "Creating..."
                          :
                          "Create Ad"
                        }
                        </button>
                        <div className="bycreatingnewadsyou">
                          By creating a new ad, you accept our Terms & Services
                        </div>
                        
                    </form> 
                    
                  }
                  <div className="upgradePlann">
                    <i className='fa-solid fa-rocket' ></i>&nbsp;&nbsp;Upgrade you plan
                  </div>
                  </>
                }
                </div>
                <div className='zurqeuzeqfuuo'>
                {
                  loader2 ? "Fetching All Ads Created..."
                  :
                  <>
                  {
                    allAds && 
                    <>
                    {
                      allAds.length === 0 ? <div className="noDatanoData">
                        <span>
                          No ads have been created yet. Get started by creating your first ad!
                        </span>
                        <span>
                          <i className='fa-solid fa-arrow-left'></i>&nbsp;&nbsp;There !
                        </span>
                      </div>
                      :
                      <div className="allAdsContTainer">
                        {
                          allAds.map((ad, index)=>{
                            return(
                              <SingleAds handlFetchAllAds={handlFetchAllAds} ad={ad} index={index} />
                            )
                          })
                        }
                      </div>
                    }
                    </>
                  }
                  </>
                }
                </div>
         </div>

                
        </div>

      :
      <div className='eqdhoqe'>
        <span>
          <img className='zueoqcd' src={LoaderSvg} alt="" />
          <span>
          Loading...
          </span>
        </span>
      </div>
      }
     

  </div>
  )
}

export default AdserPanel2