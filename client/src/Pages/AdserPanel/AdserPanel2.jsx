import React, { useEffect, useState } from 'react'
import {useNavigate , useParams} from 'react-router-dom'
import axios from 'axios';



const AdserPanel2 = () => {

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
      setloader(true);
      if(token &&  title.length >= 10 && description.length >= 20 && image.length >= 14){
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



    const [loaderOfDelete, setloaderOfDelete] = useState(false);


    const DeleteAd = async (id)=>{
      setloaderOfDelete(true);
      if(token){
          
        try{
          const resp = await axios.get(`http://localhost:3001/ads/delete/${id}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            setloaderOfDelete(false);
            handlFetchAllAds();
            console.log(resp);
          } 
          else{
            setloaderOfDelete(false);
            console.log(resp);
            handlFetchAllAds();
          }
        }
        catch(e){
          setloaderOfDelete(false);
          console.log(e.message);
        } 
      
      }

    }



    return (
    <div>
      <h1>
        Create your add (<>Plan : {planOfUser && <>{planOfUser === 1 ? "Basic" : planOfUser === 2 ? "Standard" : planOfUser === 3 && "Premium" }</>}</>)
      </h1>
      <hr />
      <span>
        Max Ads to create : {maxAdsToCreated && maxAdsToCreated}
      </span>
      <hr />
      <span>
      Remaining Ads : {(allAds && maxAdsToCreated )&&  (maxAdsToCreated - allAds.length)  }
      </span>
      <hr />
      {
        allAds && maxAdsToCreated && 
        <>
        {
          maxAdsToCreated !== allAds.length && 
          <form onSubmit={handlCreate}>
              <input
                value={title} 
                type="text"
                onChange={(e)=>{
                  settitle(e.target.value);
                }}
                placeholder='Enter the title of your ads...'
              />
              <hr />
              <input
                value={description} 
                type="text"
                onChange={(e)=>{
                  setdescription(e.target.value);
                }}
                placeholder='Enter the description of your ads...'
              />
              <hr />
              <input
                value={image} 
                type="text"
                onChange={(e)=>{
                  setimage(e.target.value);
                }}
                placeholder='Enter the image of your ads...'
              />
              <hr />
              <button
                type="submit"
                disabled={loader}
              >
              {
                loader ? "Creating..."
                :
                "Create Ad"
              }
              </button>
              <hr />
          </form> 
        }
        </>
      }
      <hr />
      
      {
        loader2 ? "Fetching All Ads Created..."
        :
        <>
        {
          allAds && 
          <>
          {
            allAds.length === 0 ? "No ads was created By You..."
            :
            allAds.map((ad, index)=>{
              return(
                <>
                  <span>Title : {ad.title}</span>
                  <br />
                  <span>Description : {ad.description}</span>
                  <br />
                  <span>Image Url : {ad.image}</span>
                  <br />
                  <span>Total Clicks : {ad.click}</span>
                  <br />
                  <span>Total Views : {ad.views && ad.views.length}</span>
                  <br />
                  <button
                    type='button'
                    disabled={loaderOfDelete}
                    onClick={()=>{
                      DeleteAd(ad._id);
                    }}
                  >
                  {
                    loaderOfDelete ? "Deleting..."
                    :
                    "Delete this Ad"
                  }
                  </button>
                  <hr />
                </>
              )
            })
          }
          </>
        }
        </>
      }
    </div>
  )
}

export default AdserPanel2