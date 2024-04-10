import React, {useRef, useState} from 'react'
import './index.css';
import Camera from './c.png';
import Picture from './i.png';
import Feeling from './f.png';
import ClickOutsider from '../../Helpers/HidePopUp';
import axios from 'axios';



const CreatePostForPages = ({ajusting,pageId, isFetchingUser, dataUserCurrent, renderParent }) => {
  

    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('token');
    const popUpCP = useRef(null);
    const pôpUpEmojis = useRef(null);
    const [isCreateClicked, setisCreateClicked] = useState(false);
    const [emojiShow, setEmojiShow] = useState(false);
    const [textArea, settextArea] = useState('');
    const [images, setimages] = useState('');
    const [isSubmitClicked, setisSubmitClicked] = useState(false);

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

    const handleSubmit = async(event)=>{
      setisSubmitClicked(true);
      event.preventDefault();
      if(token && pageId){
        if(images === "" && textArea === ""){
          console.log("Empty Field");
        }
        else{
          try{
            const resp = await axios.post("http://localhost:3001/post/createPagePost/", {
              creator : pageId, 
              image : images, 
              description : textArea, 
              type : "normal" , 
              isPagePost : true        
            }, {
              headers : {
                Authorization : `Bearer ${token}`
              }
            }); 
            if(resp.status=== 200){
              renderParent();
              setisCreateClicked(false);
              setimages("");
              settextArea("");
            }
            else{
              alert("Error Creating Post");
            }
          }
          catch(error){
            alert("Error Creating Post");
            console.log(error.message);
          }
        }
      }
    }

  return (
    <>


      <div   className={isCreateClicked ? "popUpCreatePost showpopUpCreatePost" : "popUpCreatePost"}>
        <form onSubmit={handleSubmit}  ref={popUpCP} className="containerpopUpCreatePost">
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
            <textarea  value={textArea} onChange={(e)=>{setisSubmitClicked(false);settextArea(e.target.value)}}  spellCheck={false} onClick={()=>{setEmojiShow(false);}} placeholder='Type something...' >
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
            <input value={images} onChange={(e)=>{setisSubmitClicked(false);setimages(e.target.value)}} type="text" placeholder='Your image URL' spellCheck={false} />
          </div>
          <div className="zowZ2">
            <button
              className='sjqdkc'
              type='submit'
              disabled={isSubmitClicked}
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

export default CreatePostForPages