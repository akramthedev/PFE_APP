import React, { useState } from 'react'
import './index.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


const Settings = () => {


  const [loader, setLoader] = useState(false);
  const [current, setcurrent] = useState("");
  const [confnew, setconfnew] = useState("");
  const [newpass, setnewpass] = useState("");

  const token = localStorage.getItem('token');
  const idUser = localStorage.getItem('idUser');

  const nav = useNavigate();

  const submit = async(e)=>{
    e.preventDefault();
    setLoader(true);
    if(confnew === "" || current === "" || newpass === ""){
      console.log("Empty Fields");
    }
    else{
      if(newpass === confnew){
        try {
          const resp = await axios.post(`http://localhost:3001/user/change-password/${idUser}`,{
            pass : current, 
            newpass : newpass
          }, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            setcurrent("");  
            setconfnew("");
            setnewpass("");            
            alert('Password changed successfully!');
          }
          else{
            alert('Oops, something went wrong!');
          }
        } catch (error) {
          alert('500 | Internal server error');
          console.log(error.message);
        }
      }
    }
    setLoader(false);
  }


  return (
    <div className='Settings'>
      <div onClick={()=>{nav('/')}} className="backHome">
        <i className='fa-solid fa-arrow-left'></i>&nbsp;&nbsp;Back Home
      </div>
      <form onSubmit={submit}  className="container368">
        <div className="row66 row65">
          <i style={{fontSize : "14px"}} className='fa-solid fa-lock'></i>&nbsp;&nbsp;&nbsp;Change&nbsp;Password
        </div>
        <div className="row66" />

        <div className="row66 row78">
          <span>Current Password</span>
          <input value={current} onChange={(e)=>{setcurrent(e.target.value)}}  type="password" placeholder='Enter your current password...' />
        </div>

        <div className="row66 row78 ">
        <span>New Password</span>
          <input value={newpass} onChange={(e)=>{setnewpass(e.target.value)}}  type="password" placeholder='Enter your new password...' />
        </div>

        <div className="row66 row78">
        <span>Confirm Password</span>
          <input value={confnew}  onChange={(e)=>{setconfnew(e.target.value)}} type="password" placeholder='Confirm your new password...' />
        </div>
        <br />
        <div className="row66 ">
          <button
            type='submit'
            className={ loader || (confnew === "" || current === "" || newpass === "") && "NoPointerX"}
            disabled={loader || (confnew === "" || current === "" || newpass === "")}
          >
          {
            loader ? "Processing changes...":"Submit changes"
          }
          </button>
        </div>

      </form>
    </div>
  )
}

export default Settings