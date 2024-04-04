import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Auth from './Pages/Auth/Auth';


function App() {

  const token = localStorage.getItem('token');

  return (
    <div>
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;