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
import PostSuggestedUsers from '../../Components/Post/PostSuggestedUsers';
import OpenerMp3 from '../../MP3Sounds/openingAuth.wav';
import SkeltonPost from '../../Components/Post/SkeltonPost';



const Home = ({ isFetchingUser, dataUserCurrent, ResponseRequest}) => {

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const [allPosts, setAllPosts] = useState([]);
    const [postLoading, setpostLoading] = useState(true);

    const fetchAllPosts = async ()=>{
      try{
        setpostLoading(true);
        const resp = await axios.get('http://localhost:3001/post/');
        if(resp.status === 200){
          setAllPosts(resp.data);
        }
        else{
          setAllPosts([]);
        }
      }
      catch(e){
        console.log(e.message);
      } finally{
        setpostLoading(false);
      }
    }


    useEffect(()=>{
      fetchAllPosts();
    }, []);

    
  
    useEffect(()=>{

      const x = ()=>{
        window.scrollTo({
          top: 0,
          left: 0,
          behavior : "instant",
        });    
      }
      x();

  }, []);

  return (
    <div className='Home'>
      
        

          <Navbar  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <CreatePost ajusting="home" isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              {
                postLoading ? 
                <>
                  <SkeltonPost /><SkeltonPost />
                </>
                :
                <>
                {
                  allPosts && <>
                    {
                      allPosts.length === 0 ? 
                      <>
                        No Post yet
                      </>
                      :
                      <>
                        {
                          allPosts.map((post, index)=>{
                            return(
                              <Post  index={index}  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} post={post} />
                            )
                          })
                        }
                        <PostAds />
                        <PostSuggestedUsers  />
                      </>
                    }
                  </>
                }
                </>
              } 
            </div>
            <div className="h3">
              <Ads />
              <BirthDays  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts    isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}   />
            </div>
          </div>
       
    </div>
  )
}

export default Home