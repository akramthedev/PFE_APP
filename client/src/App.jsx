import React, {useState, useEffect} from 'react';
import './App.css';
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
import io from 'socket.io-client';



function App() {

  let socket = io.connect("http://localhost:3001/");
  const token  = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser'); 


  const enterGlobalRoom = ()=>{
    if(token && idUser){
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
              token ? <Home socket={socket} /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/profile/:id' 
            element={
              token ? <Profile socket={socket} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/page/:id' 
            element={
              token ? <Page socket={socket} /> : <Navigate to="/auth" />
            } 
          />
          <Route  
            path='/group/:id' 
            element={
              token ? <Group socket={socket} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/ads/:id' 
            element={
              token ? <ADS /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/notifications' 
            element={
              token ? <Notifications socket={socket} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/requests' 
            element={
              token ? <Requests socket={socket} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/discussions' 
            element={
              token ? <Discussions socket={socket} /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/discussions/chat/:id' 
            element={
              token ? <Chat /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/settings' 
            element={
              token ? <Settings /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/help' 
            element={
              token ? <Help /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/accessibility' 
            element={
              token ? <Accessibility /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/admin/panel' 
            element={
              token ? <AdminPanel socket={socket} /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/adser/panel' 
            element={
              token ? <AdserPanel socket={socket} /> : <Navigate to="/auth" />
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