import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';


const SinglePageCompo = ({page}) => {
  
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [data, setData] = useState(null);


    useEffect(()=>{
        const fetch = async()=>{
            if(page){
              try{
                const resp = await axios.get(`http://localhost:3001/page/${page}`, {
                  headers : {
                    Authorization : `Bearer ${token}`
                  }
                });
                if(resp.status === 200){
                    setData(resp.data);
                }
                else{
                    navigate("/");
                }
              }
              catch(e){
                  console.log(e.message);
                  navigate("/");
              }
            }
        }
        fetch();
    }, []);


    return (
    <>
    {
        page && data && 
          <div className="rowX rowXX"
            onClick={()=>{
              navigate(`/page/${page}`);
            }}
          >
            <div className="flesh" />
            <div className=" xxx xxxxxx">
              <img 
                src={data.profilePic} 
                alt=""
              />
            </div>
            <span className='zoqdzoqd'>{data.name}</span>
          </div>
    }
    </>
)
}

export default SinglePageCompo