import React, {useState, useEffect} from 'react'
import axios from 'axios';
import './SingleComment.css';

const SingleComment = ({comment}) => {
  

  const [dataCommentator, setdataCommentator] = useState(null);
  const token = localStorage.getItem('token');

   
  const fetchUser = async ()=>{
    if(comment && token ){
      try{
        const resp = await axios.get(`http://localhost:3001/user/${comment.commentator}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          console.log(resp.data);
          setdataCommentator(resp.data);
        }
      }
      catch(e){
         
      }  
    }
  }

  useEffect(()=>{
    fetchUser();
  }, []);
  
  return (
    <>
    {
        (comment && dataCommentator) && 
        <div className='SingleComment'>
          <div className="hiqdkc">
            <img src={dataCommentator.profilePic} alt="PictureProfile" />
            <span>{dataCommentator.fullName}</span>
          </div>
          <div className="qodfsfdw">
            {
              comment.comment
            }
          </div>
        </div>

    }
    </>
  )
}

export default SingleComment