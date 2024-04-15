import React, {useState, useEffect, useRef} from 'react'
import './UtilsAndNavigations.css';
import {useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../../Helpers/SocketContext';
import '../../Pages/Profile/index.css';
import SinglePageCOmpo from '../SinglePageCompo/SinglePageCompo';
import axios from 'axios';


const UtilsAndNavigations = ({isFetchingUser, dataUserCurrent, setisCreatedPageCLicked}) => {
   

    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const { socket, onlineUsers } = useSocket();  
    const token = localStorage.getItem('token');


    const [allUsersLenght,setallUsersLenght] = useState(null);

    
    const getAllUsersLength = async()=>{
      try {
        const resp = await axios.get('http://localhost:3001/user/', {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setallUsersLenght(resp.data.length);
        }
        else{
          setallUsersLenght(37)
        }
      } catch (error) {
        setallUsersLenght(37);
        console.log(error);
      }
    }
    
    useEffect(()=>{
      getAllUsersLength();
    }, []);


  return (
    <>

      
    
    <div className='UtilsAndNavigations' >
      
      <div className="rowX rowXNoHover">
         <div className="connectedBull" />
        <span style={{ color : "limegreen", fontWeight : '500'}} >Members Online&nbsp;&nbsp;:&nbsp;&nbsp;{onlineUsers && socket  && `${onlineUsers }`}{allUsersLenght && <>&nbsp;/&nbsp;{allUsersLenght}</>}</span>
      </div>


      <div className="rowX"
        onClick={()=>{
          navigate("/");
        }}
      >
        <div className="xxx">
          <i className='fa-solid fa-house'></i>
        </div>
        <span>Home</span>
      </div>

      <div className="rowX"
        onClick={()=>{
          if(dataUserCurrent && !isFetchingUser){
            navigate(`/profile/${dataUserCurrent._id}`);
          }
        }}
      >
        <div className="xxx xxxxxx">
        {
          !isFetchingUser && dataUserCurrent && 
          <img 
            src={dataUserCurrent.profilePic}
            alt="yourprofilePicture"
          />
        }
        </div>
        <span>
        {
          !isFetchingUser && dataUserCurrent && 
          dataUserCurrent.fullName
        }
        </span>
      </div>


      

      <div className="ruler"/>

      <div className="rowX"
        onClick={()=>{
          localStorage.setItem('saved', "true");
          if(dataUserCurrent && !isFetchingUser){
            navigate(`/profile/${dataUserCurrent._id}`);
          }
        }}  
      >
        <div className="xxx">
          <i className='fa-solid fa-bookmark'></i>
        </div>
        <span>Saved Posts</span>
      </div>



     
        {
          (dataUserCurrent && (dataUserCurrent.role=== "adser" || dataUserCurrent.role === "admin")) && 
            <div className="rowX"
              onClick={()=>{
                if(dataUserCurrent && !isFetchingUser){
                  if(dataUserCurrent.role === "admin"){
                    navigate(`/admin/panel`);
                  }
                  else if (dataUserCurrent.role === "adser"){
                    navigate(`/adser/panel`);
                  }
                }
              }}  
            >
            <div className="xxx">
              <i className='fa-solid fa-chart-line'></i>
            </div>
            <span>Dashboard</span>
          </div>
        }
       
      <div className="rowX rowXNoHover">
        <div className="xxx">
          <i className='fa-solid fa-scroll'></i>
        </div>
        <span>Pages</span>
      </div>
      
        <div className="rowJaja">
          
          
          {
            dataUserCurrent && 
            <>
            {
              dataUserCurrent.pages.length === 0 ? 
              <div className="rowXXrowXX">
                Search for page you may like or even create your own one!
              </div>
              :
              dataUserCurrent.pages.map((page)=>{
                return(
                  <SinglePageCOmpo page={page} />
                )
              })
            }
            </>
          }

         

          <div className="rowX rowXX rowXXrowXX"/>

        </div>
        <div className="rowX rowXNoHover">
          <button className='CreatePage'
            onClick={()=>{
              setisCreatedPageCLicked(true);
            }}
          >
            Create Page
          </button>
        </div>

      <br />
      
      
       
 

        <div className="rowX"
          onClick={()=>{
            localStorage.setItem('saved', "true");
            navigate("/contact");
          }}  
        >
          <div className="xxx">
            <i className="fa-solid fa-arrows-to-circle"></i>
          </div>
          <span>Content policy</span>
        </div>

        <div className="rowX"
          onClick={()=>{
            localStorage.setItem('saved', "true");
            navigate("/contact");
          }}  
        >
          <div className="xxx">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <span>Privacy policy</span>
        </div>

        <div className="rowX"
          onClick={()=>{
            localStorage.setItem('saved', "true");
            navigate("/contact");
          }}  
        >
          <div className="xxx">
            <i className='fa-solid fa-book-open'></i>
          </div>
          <span>Terms of use</span>
        </div>


        <div className="rowXXX rowX"
        >
          Xplorium, Inc. © 2024. All rights reserved.
        </div>


    </div>
    </>
  )
}

export default UtilsAndNavigations