import React from 'react'
import './UtilsAndNavigations.css';
import {useNavigate } from 'react-router-dom';



const UtilsAndNavigations = () => {


  const navigate = useNavigate();


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
          navigate("/profile/666");
        }}
      >
        <div className="xxx xxxxxx">
          <img 
            src="https://akramelbasri.com/static/media/img.bbbb721ddafd04f09a9d.png"
            alt="yourprofilePicture"
          />
        </div>
        <span>Akram El Basri</span>
      </div>

      <div className="ruler"/>

      <div className="rowX"
        onClick={()=>{
          localStorage.setItem('contacts', "true");
          navigate("/profile/666");
        }}
      >
        <div className="xxx">
          <i className='fa-solid fa-user-group'></i>
        </div>
        <span>Contacts</span>
      </div>

      <div className="rowX"
        onClick={()=>{
          localStorage.setItem('saved', "true");
          navigate("/profile/666");
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

    </div>
  )
}

export default UtilsAndNavigations