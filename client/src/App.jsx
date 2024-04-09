import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Auth from './Pages/Auth/Auth';
import OTPverify from './Pages/OTPverify/OTPverify';
import Contact from './Pages/Contact/Contact';
import Profile from "./Pages/Profile/Profile";
import  Page from "./Pages/Page/Page";
import Group from "./Pages/Group/Group";
import ADS from "./Pages/ADS/ADS";
import Notifications from "./Pages/Notifications/Notifications";
import Requests from "./Pages/Requests/Requests";
import Discussions from "./Pages/Discussions/Discussions";
import Chat from "./Pages/Chat/Chat";
import Settings from "./Pages/Settings/Settings";
import Help from "./Pages/Help/Help";
import Accessibility from "./Pages/Accessibility/Accessibility";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import AdserPanel from "./Pages/AdserPanel/AdserPanel";
import { useSocket } from './Helpers/SocketContext';
import HttpRequestStatus from './Components/HttpRequestStatus/HttpRequestStatus';



function App() {
 
  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');
  const { socket } = useSocket();

  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [dataUserCurrent, setdataUserCurrent] = useState(null);
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
          setdataUserCurrent(null);
          console.log(resp.data);
          setTimeout(()=>{
            setdataUserCurrent(resp.data);
          }, 170);
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


  
  useEffect(()=>{
    fetchUser();
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
            path='/auth/verify-email' 
            element={
              !token ? <OTPverify /> : <Navigate to="/" />
            } 
          />

          <Route  
            path='/' 
            element={
              token ? <Home ResponseRequest={ResponseRequest}  isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} renderUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/profile/:id' 
            element={
              token ? <Profile isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/page/:id' 
            element={
              token ? <Page  isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser} /> : <Navigate to="/auth" />
            } 
          />
          <Route  
            path='/group/:id' 
            element={
              token ? <Group isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} fetchCurrentUser={fetchUser}  /> : <Navigate to="/auth" />
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
              token ? <Notifications isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}  /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/requests' 
            element={
              token ? <Requests renderUserInfos={fetchUser} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}  /> : <Navigate to="/auth" />
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
            path='/contact' 
            element={
              <Contact/>
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