import React, {useState} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'
import SuggestedUserSingleCompoent from './SuggestedUserSingleCompoent';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PostSuggestedUsers = ({suggestedUsers}) => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };
    
    const naviagte = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    
    const nextSlide = () => {
        setActiveIndex((prevIndex) =>
          prevIndex === suggestedUsers.length - 1 ? 0 : prevIndex + 1
        );
    };
    
    const prevSlide = () => {
        setActiveIndex((prevIndex) =>
          prevIndex === 0 ? suggestedUsers.length - 1 : prevIndex - 1
        );
    };
    

    return (
    <div className='Post'>
    {
        suggestedUsers && 
        <>
        {
            suggestedUsers.length !== 0 && 
            <Slider {...settings}>
            {
                suggestedUsers.map((user, index)=>{
                    return(
                        <div className='singleOneX' key={index} >
                        {
                            user.fullName
                        }
                        </div>
                    )
                })
            }
            </Slider>
        }
        </>
    }
    </div>
    )
}


export default PostSuggestedUsers;