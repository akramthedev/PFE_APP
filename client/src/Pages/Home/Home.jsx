import React, {useState, useEffect} from 'react'
import './Home.css';
import Navbar from '../../Components/Navbar/Navbar';
import CreatePost from '../../Components/CreatePost/CreatePost';
import Post from '../../Components/Post/Post';
import PostAds from '../../Components/Post/PostAds';
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";


const Home = ({socket}) => {

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [dataUserCurrent, setdataUserCurrent] = useState(null);

    
    const fetchUser = async ()=>{
      if(idUser && token){
        try{
          const resp = await axios.get(`http://localhost:3001/user/${idUser}`, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            console.log(resp.data);
            setdataUserCurrent(resp.data);
          }
          else{
            alert('Error 202');
          }
        }
        catch(e){
          alert('500 | Error Server');
          console.log(e.message);
        } finally{
          setIsFetchingUser(false);
        }
      }
    }

    useEffect(()=>{
      fetchUser();
    }, []);


  return (
    <div className='Home'>
      
          <Navbar socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <CreatePost  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Post  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <PostAds /> 
            </div>
            <div className="h3">
              <Ads />
              <BirthDays  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts    isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} socket={socket}  />
            </div>
          </div>
       
    </div>
  )
}

export default Home