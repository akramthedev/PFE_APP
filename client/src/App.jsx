import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import UpgradeYourPlan from "./Pages/AdserPanel/UpgradeYourPlan";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Successfull from './Pages/AdserPanel/Successfull';
import Auth from './Pages/Auth/Auth';
import AccountBlocked from './Pages/Auth/AccountBlocked'
import OTPverify from './Pages/OTPverify/OTPverify';
import AdserPanel2 from './Pages/AdserPanel/AdserPanel2'
import Contact from './Pages/Contact/Contact';
import Profile from "./Pages/Profile/Profile";
import  Page from "./Pages/Page/Page";
import ADS from "./Pages/ADS/ADS";
import Notifications from "./Pages/Notifications/Notifications";
import Requests from "./Pages/Requests/Requests";
import Discussions from "./Pages/Discussions/Discussions";
import Settings from "./Pages/Settings/Settings";
import Help from "./Pages/Help/Help";
import Accessibility from "./Pages/Accessibility/Accessibility";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import AdserPanel from "./Pages/AdserPanel/AdserPanel";
import UnsuccessfullPanel from './Pages/AdserPanel/UnsuccessfullPanel';
import { useSocket } from './Helpers/SocketContext';
import Cloudinary from './Pages/Cloudinary';
import TermsOfUse  from "./Pages/PrivacyPolicy/TermsOfUse";
import ContentPolicy  from "./Pages/PrivacyPolicy/ContentPolicy";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";





function App() {
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');
  const { socket } = useSocket();
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [fetchingAds, setfetchingAds] = useState(true);
  const [dataUserCurrent, setdataUserCurrent] = useState(null);
  const [dataAds, setdataAds] = useState(null);
  const [ResponseRequest, setResponseRequest] = useState(null);



  const fetchUser = async ()=>{
    if(idUser && token){
      try{
        const resp = await axios.get(`http://localhost:3001/user/${idUser}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setdataUserCurrent(resp.data);
          setResponseRequest({
            status : 200, 
            msg : "User Fetched"
          });
        }
        else{
          setResponseRequest({
            status : 201, 
            msg : "User Not Fetched"
          });
        }
      }
      catch(e){
        setResponseRequest({
          status : 500, 
          msg : "Oops, something went wrong with the server!"
        });
        console.log(e.message);
      } finally{
        setIsFetchingUser(false);
      }
    }
  }



  const fetchAds = async ()=>{
    if(token && idUser){
      try{
        const resp = await axios.get(`http://localhost:3001/ads/fetchSomeAds/${idUser}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          console.log(resp.data);
          setdataAds(resp.data);    
        }
         
      }
      catch(e){
        console.log(e.message);
      } finally{
        setfetchingAds(false);
      }
    }
  }

  
  useEffect(()=>{
    fetchUser();
    fetchAds();
  }, []);

  const enterGlobalRoom = ()=>{
    if(token && idUser && socket){
      socket.emit("enterGlobalRoom",idUser);
    }
  }

  useEffect(()=>{
    enterGlobalRoom();
  }, []);

  return (
      <BrowserRouter>
        <Routes> 
          

          <Route  
            path='/auth' 
            element={
              !token ? <Auth /> : <Navigate to="/" />
            } 
          />

          <Route  
            path='/account-blocked' 
            element={
              !token ? <AccountBlocked /> : <Navigate to="/" />
            } 
          />


          <Route  
            path='/auth/verify-email' 
            element={
              !token ? <OTPverify /> : <Navigate to="/" />
            } 
          />

          <Route  
            path='/' 
            element={
              token ? <Home dataAds={dataAds} ResponseRequest={ResponseRequest}  isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} renderUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/profile/:id' 
            element={
              token ? <Profile dataAds={dataAds} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/page/:id' 
            element={
              token ? <Page fetchUser={fetchUser} dataAds={dataAds}  isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
         
          
          <Route  
            path='/ads/:id' 
            element={
              token ? <ADS isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/notifications' 
            element={
              token ? <Notifications dataAds={dataAds} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}  /> : <Navigate to="/auth" />
            } 
          />
          
          
          <Route  
            path='/requests' 
            element={
              token ? <Requests dataAds={dataAds}  renderUserInfos={fetchUser} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}  /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/discussions' 
            element={
              token ? <Discussions isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/settings' 
            element={
              token ? <Settings isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/help' 
            element={
              token ? <Help isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/accessibility' 
            element={
              token ? <Accessibility isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/admin/panel' 
            element={
              token ? <AdminPanel isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/adser/panel' 
            element={
              token ? <AdserPanel isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/adser/panel/payment/unsuccessfull' 
            element={
              token ? <UnsuccessfullPanel isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  /> : <Navigate to="/auth" />
            } 
          />
          <Route  
            path='/adser/panel/payment/successfull' 
            element={
              token ? <Successfull isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/cloudinary' 
            element={
              token ? <Cloudinary /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/adser/panel/upgrade/:plan' 
            element={
              token ? <UpgradeYourPlan isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  /> : <Navigate to="/auth" />
            } 
          />




 
          <Route  
            path='/adser/panel/plan/:token'
            element={
              token ? 
                <AdserPanel2 isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  />
                : 
                <Navigate to="/" />
            } 
          />
          

          <Route  
            path='/contact' 
            element={
              <Contact/>
            } 
          />


          <Route  
            path='/privacypolicy' 
            element={
              <PrivacyPolicy/>
            } 
          />
          <Route  
            path='/contentpolicy' 
            element={
              <ContentPolicy/>
            } 
          />
          <Route  
            path='/termsofuse' 
            element={
              <TermsOfUse/>
            } 
          />


          <Route  
            path='*' 
            element={
              <Navigate to="/" />
            } 
          />
          
        </Routes>
      </BrowserRouter>
  );
}

export default App;