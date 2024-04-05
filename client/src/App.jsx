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



function App() {

  const token = localStorage.getItem('token');

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
              token ? <Home /> : <Navigate to="/auth" />
            } 
          />

          <Route  
            path='/profile/:id' 
            element={
              token ? <Profile /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/page/:id' 
            element={
              token ? <Page /> : <Navigate to="/auth" />
            } 
          />
          <Route  
            path='/group/:id' 
            element={
              token ? <Group /> : <Navigate to="/auth" />
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
              token ? <Notifications /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/requests' 
            element={
              token ? <Requests /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/discussions' 
            element={
              token ? <Discussions /> : <Navigate to="/auth" />
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
              token ? <AdminPanel /> : <Navigate to="/auth" />
            } 
          />
          
          <Route  
            path='/adser/panel' 
            element={
              token ? <AdserPanel /> : <Navigate to="/auth" />
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