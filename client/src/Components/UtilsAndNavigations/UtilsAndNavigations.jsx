import React, {useState, useEffect} from 'react'
import './UtilsAndNavigations.css';
import {useNavigate } from 'react-router-dom';



const UtilsAndNavigations = ({socket, isFetchingUser, dataUserCurrent}) => {


  const navigate = useNavigate();
  const [OnlineNumber, setOnlineNumber] = useState(null);


  useEffect(()=>{
      socket.on('getNumOnlineUsers', (data)=>{
          setOnlineNumber(data);
      });
  }, [socket]);

  return (
    <div className='UtilsAndNavigations' >
      
      <div className="rowX"
        onClick={()=>{
          navigate("/");
          navigate(0);
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

      <div className="rowX rowXNoHover">
        <div className="xxx">
          <i className='fa-solid fa-signal'></i>
        </div>
        <span><div className="connectedBull"></div>Online members&nbsp;&nbsp;:&nbsp;&nbsp;{OnlineNumber && `${OnlineNumber}`}</span>
      </div>

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
        <span>Saved</span>
      </div>


      <div className="rowX rowXNoHover">
        <div className="xxx">
          <i className='fa-solid fa-scroll'></i>
        </div>
        <span>Pages</span>
      </div>
      
        <div className="rowJaja">
          
          
          <div className="rowX rowXX"
            onClick={()=>{
              navigate("/page/666");
            }}
          >
            <div className="flesh" />
            <div className=" xxx xxxxxx">
              <img 
                src="https://cdn-media.threadless.com/submissions_wm/699345-d68e20b52df6f84fb8b491aca2c30f54.jpg" 
                alt=""
              />
            </div>
            <span>Red Pill MGTOW</span>
          </div>

          <div className="rowX rowXX"
            onClick={()=>{
              navigate("/page/666");
            }}
          >
            <div className="flesh" />
            <div className=" xxx xxxxxx">
              <img 
                src="https://cdn-media.threadless.com/submissions_wm/699345-d68e20b52df6f84fb8b491aca2c30f54.jpg" 
                alt=""
              />
            </div>
            <span>Red Pill MGTOW</span>
          </div>
 
        </div>
      
      <br />
      
      <div className="rowX rowXNoHover">
        <div className="xxx">
          <i className='fa-solid fa-people-group'></i>
        </div>
        <span>Groups</span>
      </div>
      
        <div className="rowJaja">
          
          <div className="rowX rowXX"
            onClick={()=>{
              navigate("/group/666");
            }}
          >
            <div className="flesh" />
            <div className=" xxx xxxxxx">
              <img 
                src="https://cdn-media.threadless.com/submissions_wm/699345-d68e20b52df6f84fb8b491aca2c30f54.jpg" 
                alt=""
              />
            </div>
            <span>Red Pill MGTOW</span>
          </div>

          <div className="rowX rowXX"
            onClick={()=>{
              navigate("/group/666");
            }}
          >
            <div className="flesh" />
            <div className=" xxx xxxxxx">
              <img 
                src="https://cdn-media.threadless.com/submissions_wm/699345-d68e20b52df6f84fb8b491aca2c30f54.jpg" 
                alt=""
              />
            </div>
            <span>Red Pill MGTOW</span>
          </div>

          <div className="rowX rowXX"
            onClick={()=>{
              navigate("/group/666");
            }}
          >
            <div className="flesh" />
            <div className=" xxx xxxxxx">
              <img 
                src="https://cdn-media.threadless.com/submissions_wm/699345-d68e20b52df6f84fb8b491aca2c30f54.jpg" 
                alt=""
              />
            </div>
            <span>Red Pill MGTOW</span>
          </div>
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
  )
}

export default UtilsAndNavigations