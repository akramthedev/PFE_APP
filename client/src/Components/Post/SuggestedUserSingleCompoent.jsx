import React from 'react'
import "./Post.css";


const SuggestedUserSingleCompoent = ({data}) => {


    
  return (
    <>
    {
        data && 
        <div className='suggestedUserCompoent' > 
        {
            data.fullName
        }
        </div>
    }
    </>
  )
}

export default SuggestedUserSingleCompoent