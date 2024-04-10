import React, {useState, useEffect} from 'react'
import "./index.css";
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';



const AdminPanel = ({isFetchingUser, dataUserCurrent, fetchCurrentUser}) => {
  const nav = useNavigate();

  const [isReqAdsClick, setisReqAdsClick] = useState(true);
  const [loader, setloader] = useState(true);
  const [nav1, setnav1] = useState(false);
  const [nav2, setnav2] = useState(false);
  const [allRequestsAds, setallRequestsAds] = useState([]);
  const idUser = localStorage.getItem('idUser');
  const token = localStorage.getItem('token');


  const fetchNav1 = async ()=>{
    try{
      setloader(true)
    }
    catch(e){
      console.log(e.message);
    } finally{
      setloader(false);
    }
  }

  
  const fetchNav2 = async ()=>{
    try{
      setloader(true)
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


  /*
  useEffect(()=>{
    const x = ()=>{
      setloader(true);
      if(isReqAdsClick){
        fetchAllRequestsAds();
      }
      else if(nav1){
        fetchNav1();
      }
      else if(nav2){
        fetchNav2();
      }

    }
  }, [nav1, nav2, isReqAdsClick]);
  */

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
            <div className="rowJJJ">
              Ads Requests
            </div>
            <div className="rowJJJ">
              Other Nav bar
            </div>
            <div className="rowJJJ">
              Other Nav bar
            </div>
            <div className="rowJJJ">
              Other Nav bar
            </div>
            <div className="rowJJJ">
              Other Nav bar
            </div>
          </div>    
          <div className="otherBarAp">
          {
            isReqAdsClick &&
            <>
            {
              loader ? <div className="nodata">
                <span>Loading...</span>
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
          }
          </div> 
        </div> 
      </div>
    </>
  )
}

export default AdminPanel