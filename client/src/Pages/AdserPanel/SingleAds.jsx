import React, {useState} from 'react'
import axios from 'axios';



const SingleAds = ({handlFetchAllAds,ad, index}) => {

    const token = localStorage.getItem('token');
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
    <React.Fragment key={index}>
    {
        ad &&
        <div className='SingleAds787' key={index}>
            <div className="titlexxxx">
              {ad.title}
            </div>
            <div className="descxxxx">{ad.description}</div>
            <div className="omgxxxx">
              <img src={ad.image} alt="" />
            </div>
            <div className="rowkkkk">
              <div className="clicksxxxx"><i className='fa-solid fa-arrow-pointer'></i>&nbsp;&nbsp;{ad.click}</div>
              &nbsp;&nbsp;&nbsp;&nbsp;<div className="viewsxxxx"><i className='fa-solid fa-eye'></i>&nbsp;&nbsp;{ad.views && ad.views.length}</div>
            </div>
            <button
                    type='button'
                    className={loaderOfDelete && "noCursorXX"}
                    disabled={loaderOfDelete}
                    onClick={()=>{
                    DeleteAd(ad._id);
                }}
            >
                {
                    loaderOfDelete ? "Deleting..."
                    :
                    <><i className='fa-solid fa-trash'></i>&nbsp;&nbsp;Delete this Ad</>
                }
            </button>
        </div> 
    }
    </React.Fragment>
  )
}

export default SingleAds