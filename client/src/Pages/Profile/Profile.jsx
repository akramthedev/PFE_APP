import React, {useState, useEffect} from 'react'
import './index.css';
import {useNavigate, useParams} from 'react-router-dom'
import '../Home/Home.css'
import Navbar from '../../Components/Navbar/Navbar';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import axios  from 'axios';


const Profile = ({ dataUserCurrent, isFetchingUser}) => {

  const { id } = useParams();
  const token = localStorage.getItem('token');
  const idVisited = id;  
  const currentId = dataUserCurrent&&dataUserCurrent._id;


  const [dataUserVisited, setDataUserVisited] = useState(null);
  const [loadingDataUserVisited, setloadingDataUserVisited] = useState(true);


  const fetchUserInformations = async ()=>{
    if(token && currentId && (currentId !== idVisited)){
      try{
        const resp = await axios.get(`http://localhost:3001/user/${idVisited}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setDataUserVisited(resp.data);
        }
        else{
          alert('404 | Oops, something went wrong !');
        }
      }
      catch(e){
        alert('500 | Oops, something went wrong !');
        console.log(e.message);
      } finally{
        setloadingDataUserVisited(false);
      }
    }
  }


  useEffect(()=>{
    fetchUserInformations();
  }, [idVisited]);

  return (
    <div className='Home Profile'>
      <Navbar isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
      <div className="home2">
        <div className="h0">
        {
          dataUserCurrent && (currentId === idVisited) ? "Your profile, "+dataUserCurrent.fullName
          :
          <>
          {
            loadingDataUserVisited ? "Loading Data of the visited user"
            :
            <>
            {
              dataUserVisited && 
              dataUserVisited.fullName
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

export default Profile