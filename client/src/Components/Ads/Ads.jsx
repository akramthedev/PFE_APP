import React from 'react'
import './Ads.css';


const Ads = () => {



  return (
    <div className='Ads'>
        <div className="sponsored">
            Sponsored
        </div>
        <div className="rowAds">
            <img 
                className='pictureAds'
                src='https://media.istockphoto.com/id/1020968912/fr/vectoriel/ic%C3%B4ne-de-feuille-d%C3%A9rable-symbole-canadien-illustration-vectorielle.jpg?s=612x612&w=0&k=20&c=L5NAEshTBfIk9_QjmTfT0qDoIlH6tQEg0NRNQTvFBsM='
                alt=""
            />
            <span className='jackijack'>
                <span className="titleOftheAd">
                    WORK IN CANADA
                </span>
                <span className="shortDescripton">
                    job.workincancada.om
                </span>
            </span>
        </div>
        <div className="rowAds">
            <img 
                className='pictureAds'
                src = "https://i1.sndcdn.com/artworks-wIyqUD3yoZHgsnVm-K3Ozvg-t500x500.jpg"
                alt=""
            />
            <span className='jackijack'>
                <span className="titleOftheAd">
                    ACCELERATE YOUR CAREER
                </span>
                <span className="shortDescripton">
                    jobintechagency.org
                </span>
            </span>
        </div>
    </div>
  )
}

export default Ads