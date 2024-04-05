import React from 'react'
import '../index.css';
import Camera from '../../Assets/v.png';
import Picture from '../../Assets/image.png';
import Feeling from '../../Assets/jack.png';

const CreatePost = () => {
  return (
    <div className="createPost">
            <div className="cp1">
                <img src="https://akramelbasri.com/static/media/img.bbbb721ddafd04f09a9d.png" alt="" />
                <input type="text" placeholder="What's on your mind Akram ? ..." disabled />
            </div>
            <div className="cp2">
              <button>
                <img src={Camera} alt="" />
                Live video
              </button>
              <button>
                <img src={Picture} alt="" />
                Photo/Video
              </button>
              <button>
                <img src={Feeling} alt="" />
                 Feelings/activity
              </button>
            </div> 
    </div>
  )
}

export default CreatePost