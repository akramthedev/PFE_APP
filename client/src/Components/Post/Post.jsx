import React, {useState} from 'react'
import "./Post.css";
import {useNavigate} from 'react-router-dom'

const Post = () => {


    const naviagte = useNavigate();

    const [isCommentClicked, setIsCommentClicked] = useState(false);
    const [isLoveClick, setIsLoveClick] = useState(false);
    const [IsBookMarked, setIsBookMarked] = useState(false);

    const [numberComment, setnumberComment] = useState(34);
    const [numberLikes, setnumberLikes] = useState(63);
    const [numberViews, setnumberViews] = useState(813);


    return (
    <div className='Post'>
        <div className=" rowP0 rowP1">
            <div className="c1">
                <div className="c11">
                    <img src="https://akramelbasri.com/static/media/img.bbbb721ddafd04f09a9d.png" alt="" />
                </div>
                <div className="c12">
                    <span>Akram El Basri</span>
                    <span>seasonedwebdev@gmail.com</span>
                </div>
            </div>
            <div 
                className={IsBookMarked ? "c2" : "c2"}
                onClick={()=>{
                    setIsBookMarked(!IsBookMarked);
                }}
            >
            {
                !IsBookMarked ? 
                <i class="fa-regular fa-bookmark"></i>
                :
                <i className="fa-solid fa-bookmark"></i>
            }
            </div>
        </div>
        <div className=" rowP0 rowP2">
            Hail to the kings of rock & roll ! 
        </div>
        <div className=" rowP0 rowP3">
            <img 
                src='https://bravewords.com/medias-static/images/features/2014/SlashGroupImage.jpg'
                alt=""
            />
        </div>
        <div className="rowP0 rowP4">
            7:35 PM&nbsp;&nbsp;•&nbsp;&nbsp;Apr 5, 2024
        </div>
        <div className="rowP0 rowP5">
            
            <button
                className='lsc'
                onClick={()=>{
                    if(isLoveClick){
                        setnumberLikes(numberLikes-1);
                        setIsLoveClick(false);
                    }
                    else{
                        setnumberLikes(numberLikes+1);
                        setIsLoveClick(true);
                    }
                }}
            >
                {numberLikes}
                {
                    isLoveClick ? 
                    <i className="fa-solid fa-heart fa-heartRED"></i>
                    :
                    <i className="fa-regular fa-heart"></i>
                }
            </button>
            <button
                className='lsc'
                onClick={()=>{
                    setIsCommentClicked(!isCommentClicked);
                    setTimeout(()=>{
                        if(isCommentClicked){
                            //scroll to top 
                            window.scrollTo({
                                top:window.scrollY - 100, 
                                behaviort : 'smooth'
                            })
                        }
                        else{
                            //scroll  to bottom 
                            window.scrollTo({
                                top :window.scrollY + 100, 
                                behaviort : 'smooth'
                            })
                        }
                    },200);
                }}
            >
                {numberComment}
                {
                    isCommentClicked ? 
                    <i className="fa-solid fa-comment"></i>
                    :
                    <i className="fa-regular fa-comment"></i>
                }
            </button>
            <button
                className=' lsc lsclsc'
            >
                {numberViews}
                <i class="fa-solid fa-chart-simple"></i>
            </button>            
        </div>
        <div className={isCommentClicked ? "rowP6 showrowP6" : "rowP6"}>

        </div>
    </div>
  )
}

export default Post