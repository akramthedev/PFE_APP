import React, {useRef, useState} from 'react'
import './index.css';
import Camera from '../../Assets/v.png';
import Picture from '../../Assets/image.png';
import Feeling from '../../Assets/jack.png';
import ClickOutsider from '../../Helpers/HidePopUp';
 

const CreatePost = ({ajusting, isFetchingUser, dataUserCurrent}) => {
  

    const popUpCP = useRef(null);
    const pôpUpEmojis = useRef(null);
    const [isCreateClicked, setisCreateClicked] = useState(false);
    const [emojiShow, setEmojiShow] = useState(false);
    const [textArea, settextArea] = useState('');

    ClickOutsider(popUpCP, setisCreateClicked); 
    ClickOutsider(pôpUpEmojis, setEmojiShow); 
    


    const emojis = [
      "😊", "😂", "😍", "🥰", "😎", "🤩", "😜", "😇", "😘", "🤗",
      "🤔", "😏", "😄", "😅", "😆", "😋", "😬", "😌", "😒", "😉",
      "🙃", "😁", "😳", "🤓", "😝", "🤪", "🤑", "😱", "😨", "😰",
      "😩", "😭", "😡", "😤", "🤯", "😷", "🤒", "🤢", "🤮", "🤧",
      "🥵", "🥶", "😈", "👿", "👻", "💀", "👽", "👾", 
    ];


    const addEmojiToTextArea = (emoji) => {
      settextArea(textArea => textArea + emoji);
    };

  return (
    <>


      <div   className={isCreateClicked ? "popUpCreatePost showpopUpCreatePost" : "popUpCreatePost"}>
        <form encType='multipart/form-data' ref={popUpCP} className="containerpopUpCreatePost">
          <button 
            className="closePcp"
            onClick={()=>{
              setisCreateClicked(false);
            }} 
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <div className="rowZ1">
            Create new post
          </div>
          <div className="zowZ2">
            <textarea onChange={(e)=>{settextArea(e.target.value)}}  spellCheck={false} onClick={()=>{setEmojiShow(false);}} placeholder='Type something...' >
            </textarea>
            {
              emojiShow && 
              <div ref={pôpUpEmojis}  className='emojiShow'>
              {
                emojis && 
                emojis.map((emoji)=>{
                  return(
                    <span
                      onClick={()=>{
                        addEmojiToTextArea(emoji);
                      }}
                    >{emoji}</span>
                  )
                })
              }
              </div>
            }
            <button
                type='button'
                onClick={()=>{
                  setEmojiShow(true);
                }}
                className='emojiBtn'
              >
                🙂
            </button>
          </div>
          <div className="zowZ2">
            <input type="text" placeholder='Your image URL' spellCheck={false} />
          </div>
          <div className="zowZ2">
            <button
              className='sjqdkc'
              type='submit'
            >
              Lunch the post
            </button>
          </div>
        </form>
      </div>

        <div 
          className={ajusting === "home" ? "createPost" : "createPostProfile createPost" }
          onClick={()=>{
            if(!isFetchingUser && dataUserCurrent){
              setisCreateClicked(true);
              }
            }}
        >

          

            <div className={ajusting === "home" ? "cp1" : "cp1 cp1Profile"}>
                <img  src={dataUserCurrent && dataUserCurrent.profilePic} alt=""
                onClick={()=>{
                  if(!isFetchingUser && dataUserCurrent){
                    setisCreateClicked(true);
                    }
                  }}
                />
                <input 
                  onClick={()=>{
                    if(!isFetchingUser && dataUserCurrent){
                      setisCreateClicked(true);
                      }
                    }}
                  type="text" 
                  placeholder={ !dataUserCurrent ? `What's on your mind...`:`What's on your mind ${dataUserCurrent.fullName} ? ...`} 
                  
                 />
            </div>
            <div 
              onClick={()=>{
                if(!isFetchingUser && dataUserCurrent){
                  setisCreateClicked(true);
                  }
                }}
              className="cp2"
            >
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
    </>
  )
}

export default CreatePost