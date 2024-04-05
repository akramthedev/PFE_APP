import React from 'react'
import "./Post.css";



const Post = () => {
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
            <div className="c2">
                <i className="fa-solid fa-user-plus"></i>
            </div>
        </div>
        <div className=" rowP0 rowP2">
            Hello World..
        </div>
        <div className=" rowP0 rowP3">
            <img 
                src="https://whc.unesco.org/uploads/thumbs/activity_725-2148-704-20220308132126.jpg" 
                alt=""
            />
        </div>
        <div className="rowP0 rowP4">
            7:35 PM&nbsp;&nbsp;•&nbsp;&nbsp;Apr 5, 2024
        </div>
        <div className="rowP0 rowP5">
            
            <button
                className='lsc'
            >
                2357
                <i className="fa-regular fa-heart"></i>
            </button>
            <button
                className='lsc'
            >
                41
                <i className="fa-regular fa-comment"></i>
            </button>
            <button
                className='lsc'
            >
                3795
                <i class="fa-solid fa-chart-simple"></i>
            </button>
           
            
        </div>
    </div>
  )
}

export default Post