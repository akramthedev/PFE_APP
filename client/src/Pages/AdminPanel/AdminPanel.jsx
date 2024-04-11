import React, {useState, useEffect} from 'react'
import "./index.css";
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';



const AdminPanel = ({isFetchingUser, dataUserCurrent, fetchCurrentUser}) => {
  const nav = useNavigate();

  const [isReqAdsClick, setisReqAdsClick] = useState(true);
  const [loader, setloader] = useState(true);
  const [AllAdsClicked, setAllAdsClicked] = useState(false);
  const [allRequestsAds, setallRequestsAds] = useState([]);
  const [allAds, setallAds] = useState([]);
  const idUser = localStorage.getItem('idUser');
  const token = localStorage.getItem('token');


    const fetchAllAds = async ()=>{
      try{
        setloader(true);
        const resp = await axios.get('http://localhost:3001/ads/getAllAdsForAdmin', {
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
      catch(e){
        console.log(e.message);
      } finally{
        setloader(false);
      }
    }

   


  const fetchAllRequestsAds = async ()=>{
    try{
      setloader(true);
      const resp = await axios.get('http://localhost:3001/ads/getAll', {
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
      if(resp.status === 200){
        setallRequestsAds(resp.data);
      }  
      else{
        setallRequestsAds([]);
      }
    }
    catch(e){
      console.log(e.message);
    } finally{
      setloader(false);
    }
  }

  


  const x = ()=>{
    if(isReqAdsClick){
      fetchAllRequestsAds();
    }
    else if(AllAdsClicked){
      fetchAllAds();
    }
  }

  useEffect(()=>{
    x();
  }, [ isReqAdsClick, AllAdsClicked]);





  useEffect(()=>{
    fetchAllRequestsAds();
  }, []);



  const AcceptDemand = async(id)=>{
    try{
      const isAccepetd = await axios.get(`http://localhost:3001/ads/accept-request/${id}`);
      if(isAccepetd){
        fetchAllRequestsAds();
      }
      else{
        alert('Oops, something went wrong!');
      }
    } 
    catch(error){
      alert('Internal Server Error');
      console.log(error.message);
    }
  }


  const [loaderOfDelete,setloaderOfDelete] = useState(false);

  const deleteAds = async (id)=>{
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
          fetchAllAds();
          console.log(resp);
        } 
        else{
          setloaderOfDelete(false);
          console.log(resp);
          fetchAllAds();
        }
      }
      catch(e){
        setloaderOfDelete(false);
        console.log(e.message);
      } 
    
    }

  }
 

  const RejectDemand = async(id)=>{
    try{
      const isRejected = await axios.get(`http://localhost:3001/ads/reject-request/${id}`);
      if(isRejected){
        fetchAllRequestsAds();
      }
      else{
        alert('Oops, something went wrong!');
      }
    } 
    catch(error){
      alert('Internal Server Error');
      console.log(error.message);
    }
  }

 

  return (
    <>
      <div className='AdminPanel'>  
        <Navbar isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
        <div className="kakakkak">
          <div className="sideBarAP">
            <div className="rowJJJ">
              Dashboard
            </div>
            <div 
              onClick={()=>{
                setAllAdsClicked(false);
                setisReqAdsClick(true);
              }}
              className="rowJJJ">
              New Ads Application 
            </div>

            <div 
              onClick={()=>{
                setisReqAdsClick(false);
                setAllAdsClicked(true);
              }}
              className="rowJJJ">
              All Ads List
            </div>
            
          </div>    
          <div className="otherBarAp">
          {
            isReqAdsClick ?
            <>
            {
              loader ? <div className="nodata">
                <span>Loading Ads Applications...</span>
              </div>
              :
              <>
              {
                allRequestsAds.length === 0 ? <div className="nodata nodatanodata">
                  <span>
                  No request yet
                  </span>
                </div>
                :
                <>
                {
                  allRequestsAds.map((req, index)=>{
                    return(
                      <div className="RowApplicatn">
                         <div className="rowjijiji rowjijiji2">
                          <span>
                          Company Name
                          </span>
                          <span>
                          :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                          req.companyName
                        } 
                          </span>
                        </div>
                       
                         <div className="rowjijiji rowjijiji2">
                          <span>
                          Company Descripton
                          </span> 
                          <span>
                          :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                            req.companyDesc
                          }
                          </span>
                        </div> 
                        
                         <div className="rowjijiji rowjijiji2">
                          <span>Company Website</span>                          
                          <span>
                          :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                            req.companySite !== "" ? req.companySite : "No Website"
                          }
                          </span>
                        </div>
                        
                        <div className="rowjijiji rowjijiji2">
                          <span>Age Categorie</span>
                          <span>
                          :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                            req.isForAdults ? "Adults only"
                            :
                            "All categories"
                          }
                          </span>
                        </div>
                        <div className="rowjijiji">
                          <button
                          className='qodc'
                            onClick={()=>{
                              nav(`/profile/${req.applicant}`)
                            }}
                          >
                            Visit User Profile
                          </button>
                        </div>
                        <div className="rowjijiji rowjijiji3">
                          <button
                            onClick={()=>{
                              AcceptDemand(req._id);
                            }}
                            className='acceptRAds'
                          >
                            Accept demand
                          </button>
                          <button
                            onClick={()=>{
                              RejectDemand(req._id);
                            }}
                            className='rejectRAds'
                          >
                            Reject demand
                          </button>
                        </div>
                      </div>
                    )
                  })
                }
                </>
              }
              </>
             
            }
            </>
            :
            AllAdsClicked && 
            <>
            {
              loader ? <div className="nodata">
                <span>Loading Ads...</span>
              </div>
              :
              <>
              {
                allAds.length === 0 ? <div className="nodata nodatanodata">
                  <span>
                  No Ads yet
                  </span>
                </div>
                :
                <>
                {
                  allAds.map((ad, index)=>{
                    return(
                      <div 
                        
                      className="RowApplicatn RowApplicatn2">
                         <div className="rowjijiji rowjijiji2">
                          <span>
                          Ads Title 
                          </span>
                          <span>
                          :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                          ad.title
                        } 
                          </span>
                        </div>
                       
                         <div className="rowjijiji rowjijiji2">
                          <span>
                          Ads Descripton
                          </span> 
                          <span>
                          :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                            ad.description
                          }
                          </span>
                        </div> 

                        <div className="rowjijiji rowjijiji2">
                          <span>
                          Total Clicks
                          </span> 
                          <span>
                          :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
                            ad.click
                          }
                          </span>
                        </div> 
                        
                         <div className="rowjijiji rowjijiji2">
                          <img 
                            className='imageAds'
                            src={ad.image}
                          />
                        </div>
                        
                        <div className="rowjijiji">
                          <button
                          className='qodc'
                            onClick={()=>{
                              nav(`/profile/${ad.adser}`)
                            }}
                          >
                            Visit User Profile
                          </button>
                        </div>
                        <div className="rowjijiji">
                          <button
                          className='qodc'
                            onClick={()=>{
                              deleteAds(ad._id);
                            }}
                          >
                          {
                            loaderOfDelete ? "Processing deleting ads..."
                            :
                            "Delete Ads"
                          }
                          </button>
                        </div>
                        
                      </div>
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
      </div>
    </>
  )
}

export default AdminPanel