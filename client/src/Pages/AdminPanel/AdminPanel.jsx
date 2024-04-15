import React, {useState, useEffect} from 'react'
import "./index.css";
import AllViewsImg from './voir.png';
import Album from './jacki.png'
import Navbar from '../../Components/Navbar/Navbar';
import Cus from './cus.png';
import {PieChart, Pie, Tooltip, Cell, Label} from 'recharts';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Loader from '../../Assets/spinwhite.svg';
import getTime from '../../Helpers/GetTime';
import getDate from '../../Helpers/getDate';
import { Line } from 'react-chartjs-2';
import Dollar from './dollar.png';
import 'chartjs-adapter-date-fns'; // Import date-fns adapter for Chart.js
import { 
    Chart as ChartJS,
    LineElement,
    CategoryScale, 
    LinearScale,
    PointElement,
    TimeScale
} from "chart.js"; 
import SingleTr from './SingleTr';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement,TimeScale);



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
  const [dataAdsViewsTOTAL, setdataAdsViewsTOTAL] = useState(null);


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


    function formatNumber(num) {
      if (num < 1000) {
          return num.toString();
      } else if (num >= 1000 && num < 1000000) {
          return (num / 1000).toFixed(1) + 'k';
      } else {
          return (num / 1000000).toFixed(1) + 'M';
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



    const [Turnover, setTurnover] = useState(null);
    const [LoaderTurnover, setLoaderTurnover] = useState(true);
    const [dataPayments, setdataPayments] = useState(null);


    




    const getTurnoverPerDays = async () => {
      try {
          setLoaderTurnover(true);
          const resp = await axios.get(`http://localhost:3001/stripe/getTurnover`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          if (resp.status === 200) {
              setTurnover(resp.data.totalAmount);
  
              if (resp.data.payments && resp.data.payments.data.length !== 0) {
                  // Create an object to store revenue data per day
                  const revenuePerDay = {};
  
                  resp.data.payments.data.forEach(payment => {
                      const date = new Date(payment.created * 1000);
                      const day = date.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
  
                      // If the day doesn't exist in the revenuePerDay object, initialize it
                      if (!revenuePerDay[day]) {
                          revenuePerDay[day] = 0;
                      }
  
                      // Add the payment amount to the revenue for the corresponding day
                      revenuePerDay[day] += payment.amount / 100;
                  });
  
                  // Find the minimum date among all payments
                  const minDate = new Date(Math.min(...resp.data.payments.data.map(payment => payment.created * 1000)));
                  
                  // Generate all dates from minDate to current date
                  const currentDate = new Date();
                  const allDates = [];
                  for (let d = new Date(minDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
                      allDates.push(d.toISOString().split('T')[0]);
                  }
  
                  // Populate revenuePerDay with all dates, even if no payments were made on those days
                  allDates.forEach(day => {
                      if (!revenuePerDay[day]) {
                          revenuePerDay[day] = 0;
                      }
                  });
  
                  // Convert the revenuePerDay object into arrays for Chart.js
                  const labels = Object.keys(revenuePerDay).sort();
                  const data = labels.map(day => revenuePerDay[day]);
  
                  const dataX = {
                      labels: labels,
                      datasets: [
                          {
                              label: 'Revenues',
                              data: data,
                              fill: false,
                              borderColor: 'blueviolet',
                              tension: 0.1,
                          },
                      ],
                  };
  
                  setdataPayments(dataX);
              } else {
                  setdataPayments(null);
              }
          } else {
              setdataPayments(null);
              setTurnover(null);
          }
      } catch (error) {
          setdataPayments(null);
          setTurnover(null);
          console.log(error.message);
      } finally {
          setLoaderTurnover(false);
      }
  }
  


    


    const getTurnoverPerHours = async () => {
      try {
        setLoaderTurnover(true);
        const resp = await axios.get(`http://localhost:3001/stripe/getTurnover`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (resp.status === 200) {
          setTurnover(resp.data.totalAmount);
    
          if (resp.data.payments && resp.data.payments.data.length !== 0) {
            // Create an object to store revenue data per hour
            const revenuePerHour = {};
    
            resp.data.payments.data.forEach(payment => {
              const date = new Date(payment.created * 1000);
              const hour = date.getHours(); // Get hour of the day
    
              // If the hour doesn't exist in the revenuePerHour object, initialize it
              if (!revenuePerHour[hour]) {
                revenuePerHour[hour] = 0;
              }
    
              // Add the payment amount to the revenue for the corresponding hour
              revenuePerHour[hour] += payment.amount / 100;
            });
    
            // Convert the revenuePerHour object into arrays for Chart.js
            const labels = Array.from({ length: 24 }, (_, i) => i) // Array of hours from 0 to 23
                            .sort((a, b) => b - a); // Sort the hours in descending order
            const data = labels.map(hour => revenuePerHour[hour] || 0); // Use 0 if revenue is not available for an hour
    
            const dataX = {
              labels: labels,
              datasets: [
                {
                  label: 'Revenues',
                  data: data,
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                },
              ],
            };
    
            setdataPayments(dataX);
          } else {
            setdataPayments(null);
          }
        } else {
          setdataPayments(null);
          setTurnover(null);
        }
      } catch (error) {
        setdataPayments(null);
        setTurnover(null);
        console.log(error.message);
      } finally {
        setLoaderTurnover(false);
      }
    }
    
    
    
    


    useEffect(()=>{
      getTurnoverPerDays();
    }, []);

 
  
 
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

    const [dataSingleBar, setdataSingleBar] = useState(null);

    const fetchdataSingleBar = async()=>{
      if(token){
        try{
          const resp = await axios.post('http://localhost:3001/user/getSomeInfos',{
            data : "Hello World..."
          },{
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            setdataSingleBar(resp.data);
          }
          else{
            setdataSingleBar(null);
          }
        }
        catch(e){
          setdataSingleBar(null);
          console.log(e.message);
        }
      }
    }







    const handleFetchAdsViews = async ()=>{
      if(token && idUser){
        try{
            const resp = await axios.get(`http://localhost:3001/ads/fetchAllViewsHH`);
            if (resp.data && resp.data.length !== 0) {
              setdataAdsViewsTOTAL(resp.data.length);
            } else {
              setdataAdsViewsTOTAL(-1);
            }
            console.log(resp.data);
        }
        catch(e){
          setdataAdsViewsTOTAL(-1);
          console.log(e.message);
        } 
      }
    }


    useEffect(()=>{
        fetchAllUsers();
        fetchAllAds();
        fetchAllRequestsAds();
        fetchdataSingleBar();
        handleFetchAdsViews();
    }, []);


 

  return (
    <>
      <div className='AdminPanel'>  
        {
            !allUsers && !allAds && !allRequestsAds ? <div className="nodata">
                <div className='ocddoqvnoc'>
                    <img
                        src={Loader}                        
                    />
                    Loading...
                </div>
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
                        <p style={{color: 'transparent'}} >No data to display</p>
                      )
                      }

                      
                  </div>
                  <div className="chartOfRevenuesine">
                  {
                    (!Turnover && LoaderTurnover) ? 
                  <div className='ocddoqvnoc'>
                    <img
                        src={Loader}                        
                    />
                    Loading...
                </div>
                    :
                    <>
 
                    {
                      dataPayments ?
                      <Line  
                        data={dataPayments} 
                        options={{
                          maintainAspectRatio : false,
                          plugins: {
                            title: {
                              display: true,
                              text: "Revenues"
                            },
                            legend: {
                              display: false
                            }
                          }
                        }}
                      />
                      :
                      <div className='nodataXXX'>
                        No data available
                      </div>
                    }
                    </>
                  } 
                  </div>

                  {
                    dataSingleBar ?
                    <>
                     
                  <div className="othersozqeodsc">
                    <div className="gridElement1 gridElement2">
                      <div className="centeredJJJ">
                        <div className="caseLogoS">
                          <img 
                            src={Dollar} 
                            alt=""
                            className='Loading'
                          />
                        </div>
                        <div className="numberDs">
                          {(!Turnover && LoaderTurnover) ? ""
                            :
                            <>$&nbsp;{formatNumber(Turnover/100)}</>
                          }
                        </div>
                        <div className="meaningDS">
                          Turnover
                        </div>
                      </div>
                    </div>

                    <div className="gridElement1 ">
                    <div className="centeredJJJ">
                        <div className="caseLogoS">
                          <img 
                            src={AllViewsImg} 
                            alt=""
                            className='Loading'
                          />
                        </div>
                        <div className="numberDs">
                        <>
                          {
                            dataAdsViewsTOTAL && 
                            <>
                            {
                              dataAdsViewsTOTAL === -1 ? "--" : formatNumber(dataAdsViewsTOTAL)
                            }
                            </>
                          }
                          </>
                        </div>
                        <div className="meaningDS">
                          Ads Views
                        </div>
                      </div>
                    </div>

                    <div className="gridElement1 ">
                    <div className="centeredJJJ">
                        <div className="caseLogoS">
                          <img 
                            src={Album} 
                            alt=""
                            className='Loading'
                          />
                        </div>
                        <div className="numberDs">
                        <>
                          {
                            dataSingleBar.postsLength === -1 ? "--" : formatNumber(dataSingleBar.postsLength)
                          }
                          </>
                        </div>
                        <div className="meaningDS">
                          Posts
                        </div>
                      </div>
                    </div>

                    <div className="gridElement1 gridElement2">
                    <div className="centeredJJJ">
                        <div className="caseLogoS">
                          <img 
                            src={Cus} 
                            alt=""
                            className='Loading'
                          />
                        </div>
                        <div className="numberDs">
                          <>
                          {
                            dataSingleBar.usersLength === -1 ? "--" : formatNumber(dataSingleBar.usersLength-1)
                          }
                          </>
                        </div>
                        <div className="meaningDS">
                          Users
                        </div>
                      </div>
                    </div>
                   
                  </div>
                  </>
                  :
                  <div className="oqdnscoqdnsc" />
                }
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
                            <th className='verified2 textAlignCenter'>
                                Email Verified
                            </th>
                            <th className='Location'>
                                Location
                            </th>
                            <th className='phoneNumber'>
                                Phone Num
                            </th>
                            <th className='website'>
                                Website
                            </th>
                            <th className='website'>
                                Role
                            </th>
                            <th className='status textAlignCenter'>
                                Status
                            </th> 
                            <th className='status textAlignCenter'>
                                Modify Status
                            </th>                            
                        </tr>
                        {
                                allUsers && allUsers.map((user, index)=>{
                                    
                                   if(user._id !== idUser){return(
                                        <SingleTr renderParent={fetchAllUsers} index={index} user={user} />
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
                                Payement
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
                                !allAdsers ? 
                                
                            <div className='ocddoqvnoc'>
                                <img
                                    src={Loader}                        
                                />
                                Loading...
                            </div>
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
                                                        user.fullName ? user.fullName : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        user.email ?  user.email : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                                    }
                                                    </td>
                                                    
                                                    <td className='phoneNumber'>
                                                    {
                                                        user.phoneNumber ? user.phoneNumber : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
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
                                                        </> : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
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
                                                        </> : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='role noPaddingleft'>
                                                    {
                                                      user.isPaymentDone ? <div className="xoui verifiedxxx">Successed</div> : <div className="xoui inactive">Pending</div>
                                                    }
                                                    </td>
                                                    <td className='role '>
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
                                                      <div  className='unspecified quedfuuqfhdsc quedfuuqfhdsc'>Unspecified</div>
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
                                Visit Adser
                            </th>
                            <th className='website'>
                                Created At
                            </th>
                           
                            <th className='website'>
                                Delete Ads
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
                                                        ads.title ? ads.title : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        ads.description ?  ads.description : <div  className='unspecified quedfuuqfhdsc '>Unspecified</div>
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
                                                          <i className='fa-solid fa-eye'></i>&nbsp;&nbsp;Adser
                                                        </button>  
                                                           : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
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
                                                        <i className='fa-solid fa-trash'></i>&nbsp;&nbsp;Delete
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
                                                        application.companyName ? application.companyName : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        application.companyDesc ?  application.companyDesc : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                                    }
                                                    </td>
                                                    <td className='EmailAddress'>
                                                    {
                                                        application.companySite ?  application.companySite : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
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