import React, {useState, useEffect} from 'react'
import "./index.css";
import Navbar from '../../Components/Navbar/Navbar';
import {PieChart, Pie, Tooltip, Cell, Label} from 'recharts';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Loader from '../../Assets/spinwhite.svg';
import getTime from '../../Helpers/GetTime';
import getDate from '../../Helpers/getDate';


 

const AdminPanel = ({isFetchingUser, dataUserCurrent, fetchCurrentUser}) => {
  const nav = useNavigate();

  const [isReqAdsClick, setisReqAdsClick] = useState(true);
  const [loader, setloader] = useState(true);
  const [AllAdsClicked, setAllAdsClicked] = useState(false);
  const [allRequestsAds, setallRequestsAds] = useState([]);
  const [allAds, setallAds] = useState([]);
  const idUser = localStorage.getItem('idUser');
  const token = localStorage.getItem('token');
  const COLORS = ["#ffbb00", '#20a71b', '#1867c7']; // Colors for each segment
  

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

  


  const [acceptLoader, setacceptLoader] = useState(false);

  const AcceptDemand = async(id)=>{
    try{
      setacceptLoader(true);
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
    } finally{
      setacceptLoader(false);
    }
  }


  const [loaderOfDelete,setloaderOfDelete] = useState(false);

  const deleteAds = async (id, userIdx)=>{
    setloaderOfDelete(true);
    if(token){
        
      try{
        const resp = await axios.post(`http://localhost:3001/ads/deletespecific`,{
          idAds : id, 
          adser : userIdx
        } ,{
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
 
  const [loaderReject, setLoaderReject] = useState(false);

    const RejectDemand = async(id)=>{
        try{
          setLoaderReject(true);
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
        } finally{
          setLoaderReject(false);
        }
    }


    const [allUsers, setAllUsers] = useState(null);
    const [allAdsers, setallAdsers] = useState(null);
    const [dataChart, setdataChart] = useState(null);


    const fetchAllUsers = async()=>{
        try{
              let admins = 0;
              let adser = 0;
              let users = 0;

                const resp = await axios.get(`http://localhost:3001/user/`, {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                });
                if(resp.status === 200){
                    let data = []
                    let adsersX = resp.data.filter(user => user.role === "adser");
                    setallAdsers(adsersX);
                    for(let i=0 ; i<resp.data.length ; i++){
                        if(resp.data[i].role === "admin"){
                            admins++;
                        }
                        else if(resp.data[i].role === "adser"){
                            adser++;
                        }
                        else{
                            users++;
                        }
                    }
                    data = [
                      {
                          name : "Moderators", 
                          value : admins, 
                      },
                      {
                          name : "Advertisers", 
                          value : adser, 
                      },
                      {
                          name : "Users", 
                          value : users, 
                      },
                    ]
                    setdataChart(data);
                    setTimeout(()=>{
                      setAllUsers(resp.data);
                    }, 300 );
                }
                else{
                    setAllUsers([]);
                    setallAdsers([]);
                }
        } 
        catch(error){
            setAllUsers([]);
            setallAdsers([]);
            console.log(error.message);
        }
    }

    useEffect(()=>{
        fetchAllUsers();
        fetchAllAds();
        fetchAllRequestsAds();
    }, []);


 

  return (
    <>
      <div className='AdminPanel'>  
        {
            !allUsers && !allAds && !allRequestsAds ? <div className="nodata">
                <span>
                    <img
                        src={Loader}                        
                    />
                    Loading...
                </span>
            </div>
            :
            <>
                <Navbar isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
                <div className="ChartJs ChartJsuoaeqfs">
                
                  <div className="PieChart">
                    {allUsers && dataChart  ? (
                      <>
                        <PieChart
                            width={200}
                            height={200}
                            className='qoejdfs'    
                        >
                            <Pie
                                dataKey="value"
                                isAnimationActive={true}
                                data={dataChart}
                                cx="50%" 
                                cy="50%"
                                outerRadius={80}
                                fill="red"
                                label
                            >
                                {
                                  dataChart.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                  ))
                                }
                            </Pie>
                        </PieChart>

                        <div className="hiqdcs">
                          <div className="caeozqd mod" />
                          &nbsp;&nbsp;&nbsp;Moderators&nbsp;&nbsp;({dataChart[0].value})
                        </div>
                        <div className="hiqdcs">
                          <div className="caeozqd adserx" />
                          &nbsp;&nbsp;&nbsp;Advertisers&nbsp;&nbsp;({dataChart[1].value})
                        </div>
                        <div className="hiqdcs">
                          <div className="caeozqd userx" />
                          &nbsp;&nbsp;&nbsp;Users&nbsp;&nbsp;({dataChart[2].value})
                        </div>
                        
                      </>
                      ) : (
                        <p>No data to display</p>
                      )
                      }

                      
                  </div>
                  <div className="chartOfRevenuesine">
                    Here we gonna put a Line Chart for revenue made from ads plan purchase 
                  </div>
                  <div className="othersozqeodsc">
                      Others Charts and data display if needed
                  </div>
                </div>
                <br />
                <div className="ChartJs colorizeWhite">
                    User Summary&nbsp;&nbsp;{
                      allUsers && allUsers.length-1
                    }
                </div>
                <div className="ChartJs addMargin">
                    <table className='qoesc'>
                        <tr>
                            <th className=''>
                                Num
                            </th>
                            <th className='FullName'>
                                Full Name
                            </th>
                            <th className='EmailAddress'>
                                Email Address
                            </th>
                            <th className='Location'>
                                Location
                            </th>
                            <th className='phoneNumber'>
                                Phone Num
                            </th>
                            <th className='status textAlignCenter'>
                                Status
                            </th>
                            <th className='website'>
                                Website
                            </th>
                            <th className='website'>
                                Role
                            </th>
                            <th className='verified2 textAlignCenter'>
                                Email Verified
                            </th>
                        </tr>
                        {
                                allUsers && allUsers.map((user, index)=>{
                                    
                                   if(user._id !== idUser){return(
                                        <tr >
                                            <td className='num'>
                                            {
                                                index+1
                                            }
                                            </td>
                                            <td className='FullName'>
                                            {
                                                user.fullName ? user.fullName : <div  className='unspecified'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='EmailAddress'>
                                            {
                                                user.email ?  user.email : <div  className='unspecified'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='Location'>
                                            {
                                                user.address ?  user.address : <div  className='unspecified'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='phoneNumber'>
                                            {
                                                user.phoneNumber ? user.phoneNumber : <div  className='unspecified'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='noPaddingleft textAlignCenter'>
                                            {
                                                user.status  ? <>
                                                {
                                                    user.status === "active" ? <div className="xoui verifiedxxx">Active</div>
                                                    :
                                                    user.status === "inactive" ? <div className=" xoui inactive">Inactive</div>
                                                    :
                                                    <div className=" xoui unspecified">
                                                        Suspended
                                                    </div>
                                                }
                                                </> : <div  className='unspecified'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='portfolio'>
                                            {
                                                user.portfolio ? user.portfolio : <div  className='unspecified'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='role'>
                                            {
                                                user.role ? user.role :  <div  className='unspecified'>Unspecified</div> 
                                            }
                                            </td>
                                            <td className=' textAlignCenter'>
                                            {
                                                user.isVerified  ? <div  className='verifiedxxx'>Verified</div> : <div  className='unspecified'>Unverified</div>
                                            }
                                            </td>
                                        </tr>
                                    ) 
                                  }
                                })
                            }
                    </table>
                </div> 
                <br />

                <div className="ChartJs colorizeWhite">
                    Advertiser Summary&nbsp;&nbsp;{allAdsers && allAdsers.length}
                </div>
                <div className="ChartJs addMargin">
                    <table className='qoesc'>
                        {
                            allAdsers && allAdsers.length !== 0 && 
                            <tr>
                            <th className=''>
                                Num
                            </th>
                            <th className='FullName'>
                                Full Name
                            </th>
                            <th className='EmailAddress'>
                                Email Address
                            </th>
                            
                            <th className='phoneNumber'>
                                Phone Num
                            </th>
                            <th className='status textAlignCenter'>
                                Status
                            </th>
                            <th className='website'>
                                Email Verified
                            </th>
                            <th className='website'>
                                Plan
                            </th>
                            <th className='website'>
                                Ads Number 
                            </th>
                            <th className='Location'>
                                Ads Limit
                            </th>
                           
                        </tr>
                        }
                        {
                                !allAdsers ? "Loading..."
                                :
                                <>
                                {
                                    allAdsers.length === 0 ? <span className="Nodata">No data</span> : 
                                    <>
                                    {
                                        allAdsers.map((user, index)=>{
                                            return(
                                                <tr >
                                                    <td className='num'>
                                                    {
                                                        index+1
                                                    }
                                                    </td>
                                                    <td className='FullName'>
                                                    {
                                                        user.fullName ? user.fullName : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        user.email ?  user.email : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    
                                                    <td className='phoneNumber'>
                                                    {
                                                        user.phoneNumber ? user.phoneNumber : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='noPaddingleft textAlignCenter'>
                                                    {
                                                        user.status  ? <>
                                                        {
                                                            user.status === "active" ? <div className="xoui verifiedxxx">Active</div>
                                                            :
                                                            user.status === "inactive" ? <div className=" xoui inactive">Inactive</div>
                                                            :
                                                            <div className=" xoui unspecified">
                                                                Suspended
                                                            </div>
                                                        }
                                                        </> : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className=' textAlignCenter'>
                                                    {
                                                        user.isVerified  ? <div  className='verifiedxxx'>Verified</div> : <div  className='unspecified'>Unverified</div>
                                                    }
                                                    </td>
                                                    <td className='portfolio'>
                                                    {
                                                        user.plan ? <>
                                                        {
                                                            user.plan === 1 ? "Basic":
                                                            user.plan === 2 ? "Standard" :
                                                            user.plan === 3 && "Premium"
                                                        }
                                                        </> : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='role'>
                                                    {
                                                      user.adsNumber
                                                    }
                                                    </td>
                                                    <td className='Location'>
                                                    {
                                                      user.plan ? 
                                                      <>
                                                      {
                                                            user.plan === 1 ? 3:
                                                            user.plan === 2 ? 5 :
                                                            user.plan === 3 && 7
                                                        }
                                                      </>
                                                      :
                                                      <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    
                                                </tr>
                                            )
                                        })
                                    }
                                    </>
                                }
                                </>
                            }
                    </table>
                </div> 
                <br />

                <div className="ChartJs colorizeWhite">
                    Ads Summary&nbsp;&nbsp;{allAds && allAds.length}
                </div>
                <div className="ChartJs addMargin">
                    <table className='qoesc'>
                        {
                            allAds && allAds.length !== 0 && 
                            <tr>
                            <th className=''>
                                Num
                            </th>
                            <th className='FullName'>
                                Title
                            </th>
                            <th className='EmailAddress'>
                                Description
                            </th>
                            <th className='phoneNumber'>
                                Adser
                            </th>
                            <th className='status textAlignCenter'>
                                Clicks
                            </th>
                            <th className='website'>
                                Views
                            </th>
                            <th className='website'>
                                Created At
                            </th>
                            <th className='website'>
                                Delete
                            </th>
                        </tr>
                        }
                        {
                                !allAds ? "Loading..."
                                :
                                <>
                                {
                                    allAds.length === 0 ? <span className="Nodata">No data</span> : 
                                    <>
                                    {
                                        allAds.map((ads, index)=>{
                                            return(
                                                <tr >
                                                    <td className='num'>
                                                    {
                                                        index+1
                                                    }
                                                    </td>
                                                    <td className='FullName'>
                                                    {
                                                        ads.title ? ads.title : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        ads.description ?  ads.description : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    
                                                    <td className='displayFLexAlignCnete'>
                                                    {
                                                        ads.adser ? 
                                                        <button
                                                        onClick={()=>{
                                                          nav(`/profile/${ads.adser}`)
                                                        }}
                                                        >
                                                          Visit Adser
                                                        </button>  
                                                           : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className=' textAlignCenter'>
                                                    {
                                                      ads.click
                                                    }
                                                    </td>
                                                    <td className=' textAlignCenter'>
                                                    {
                                                      ads.views.length
                                                    }
                                                    </td>
                                                    <td className='portfolio'>
                                                    {
                                                      getTime(ads.createdAt)
                                                    }
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    {
                                                      getDate(ads.createdAt)
                                                    }
                                                    </td>

                                                    <td className='displayFLexAlignCnete'>
                                                      <button
                                                        onClick={()=>{
                                                          deleteAds(ads._id, ads.adser);
                                                        }}
                                                        className='zsc'
                                                        disabled={loaderOfDelete}
                                                      >
                                                        Delete This Ads
                                                      </button>  
                                                    </td>   

                                                </tr>

                                            )
                                        })
                                    }
                                    </>
                                }
                                </>
                            }
                    </table>
                </div> 
                <br />
                <div className="ChartJs colorizeWhite">
                    New Ads Application Summary&nbsp;&nbsp;{allRequestsAds && allRequestsAds.length}
                </div>
                <div className="ChartJs addMargin">
                    <table className='qoesc'>
                        {
                            allRequestsAds && allRequestsAds.length !== 0 && 
                            <tr>
                            <th className=''>
                                Num
                            </th>
                            <th className='FullName'>
                                Company
                            </th>
                            <th className='EmailAddress'>
                                Description
                            </th>
                            <th className='phoneNumber'>
                                Website
                            </th>
                            <th className='status textAlignCenter'>
                                Age Categorie
                            </th>
                            <th className='website'>
                                Applicant
                            </th>
                            <th className='website'>
                                Created At
                            </th>
                            <th className='website'>
                                Accept
                            </th>
                            <th className='website'>
                                Reject
                            </th>
                        </tr>
                        }
                        {
                                !allRequestsAds ? "Loading..."
                                :
                                <>
                                {
                                    allRequestsAds.length === 0 ? <span className="Nodata">No data</span> : 
                                    <>
                                    {
                                        allRequestsAds.map((application, index)=>{
                                            return(
                                                <tr >
                                                    <td className='num'>
                                                    {
                                                        index+1
                                                    }
                                                    </td>
                                                    <td className='FullName'>
                                                    {
                                                        application.companyName ? application.companyName : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        application.companyDesc ?  application.companyDesc : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        application.companySite ?  application.companySite : <div  className='unspecified'>Unspecified</div>
                                                    }
                                                    </td>
                                                    
                                                    <td className='displayFLexAlignCnete'>
                                                    {
                                                        application.isForAdults ? 
                                                        "Adults Only":"All Categories"
                                                    }
                                                    </td>
                                                    <td className=' textAlignCenter'>
                                                    {
                                                      application.applicant && 
                                                      <button
                                                        onClick={()=>{
                                                          nav(`/profile/${application.applicant}`)
                                                        }}
                                                        >
                                                          Visit Applicant
                                                      </button>  
                                                      
                                                    }
                                                    </td>
                                                    <td className=' textAlignCenter'>
                                                    {
                                                      getTime(application.createdAt)
                                                    }
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    {
                                                      getDate(application.createdAt)
                                                    }
                                                    </td>
                                                    <td className='portfolio'>
                                                    <button
                                                        onClick={()=>{
                                                          AcceptDemand(application._id)
                                                        }}
                                                        disabled={acceptLoader}
                                                      >
                                                        Accept Application
                                                      </button> 
                                                    </td>

                                                    <td className='displayFLexAlignCnete'>
                                                      <button
                                                        onClick={()=>{
                                                          RejectDemand(application._id);
                                                        }}
                                                        className='zsc'
                                                        disabled={loaderReject}
                                                      >
                                                        Reject Application
                                                      </button>  
                                                    </td>   

                                                </tr>

                                            )
                                        })
                                    }
                                    </>
                                }
                                </>
                            }
                    </table>
                </div> 


            </> 
        }


      </div>
    </>
  )
}

export default AdminPanel