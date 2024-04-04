import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Auth from './Pages/Auth/Auth';
import OTPverify from './Pages/OTPverify/OTPverify';

function App() {

  const token = localStorage.getItem('token');

  return (
      <BrowserRouter>
        <Routes>
          <Route  
            path='/' 
            element={
              token ? <Home /> : <Navigate to="/auth" />
            } 
          />
          <Route  
            path='/auth' 
            element={
              !token ? <Auth /> : <Navigate to="/" />
            } 
          />
          <Route  
            path='/verify-email' 
            element={
              !token ? <OTPverify /> : <Navigate to="/" />
            } 
          />
        </Routes>
      </BrowserRouter>
  );
}

export default App;