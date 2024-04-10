import React from 'react'
import './index.css';

const AdserSymbol = () => {
  return (
      <div  onClick={()=>{alert('Verified Adser')}} className='Administrator' title='Verified Advertiser '>
            <svg role="img" width="16" height="16" viewBox="0 0 40 40" fill="#FF6719" stroke-width="1.8" stroke="#000" xmlns="http://www.w3.org/2000/svg"  ><g><title></title><path d="M17.4385 1.2681C19.3988 0.456149 21.6012 0.45615 23.5615 1.2681L31.5807 4.58976C33.5409 5.40172 35.0983 6.95911 35.9102 8.91933L39.2319 16.9385C40.0439 18.8988 40.0439 21.1012 39.2319 23.0615L35.9102 31.0807C35.0983 33.0409 33.5409 34.5983 31.5807 35.4102L23.5615 38.7319C21.6012 39.5439 19.3988 39.5439 17.4385 38.7319L9.41933 35.4102C7.45911 34.5983 5.90171 33.0409 5.08976 31.0807L1.7681 23.0615C0.956149 21.1012 0.95615 18.8988 1.7681 16.9385L5.08976 8.91933C5.90172 6.95911 7.45911 5.40171 9.41933 4.58976L17.4385 1.2681Z" fill="#FF6719" stroke="transparent"></path><path d="M27.1666 15L17.9999 24.1667L13.8333 20" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>      </div>
    )
}

export default AdserSymbol