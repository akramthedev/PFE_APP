import React, {useState, useEffect} from 'react'
import axios from 'axios';



const SingleTr = ({renderParent, index, user}) => {
  
    
    const [isClick, setIsClick] = useState(false);


    const handleUpdateStatus = async(num)=>{
        try {
            let s = null;
            if(num === 1){
                s = "active";
            }
            else if(num === 2){
                s = "inactive";
            }
            else if(num === 3){
                s = "suspended";
            }

            const resp = await axios.post(`http://localhost:3001/user/updateStatus`, {
                status : s, 
                userId : user._id
            });
            if(resp){
                setIsClick(false);
                renderParent();
            }
            else{
                alert('Something went wrong!');
            }
        } catch (error) {
            console.log(error.message);
            alert('Something went wrong!');
        }
    }

    return (
    <>    { 
    <tr  className='zuoqs' >
                                            <td className='num'>
                                            {
                                                index+1
                                            }
                                            </td>
                                            <td className='FullName'>
                                            {
                                                user.fullName ? user.fullName : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='EmailAddress'>
                                            {
                                                user.email ?  user.email : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                            }
                                            </td>
                                            <td className=' textAlignCenter'>
                                            {
                                                user.isVerified  ? <div  className='verifiedxxx'>Verified</div> : <div  className='unspecified'>Unverified</div>
                                            }
                                            </td>
                                            <td className='Location'>
                                            {
                                                user.address ?  user.address : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='phoneNumber'>
                                            {
                                                user.phoneNumber ? user.phoneNumber : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='portfolio'>
                                            {
                                                user.portfolio ? user.portfolio : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                            }
                                            </td>
                                            <td className='role'>
                                            {
                                                user.role ? user.role :  <div  className='unspecified quedfuuqfhdsc'>Unspecified</div> 
                                            }
                                            </td>
                                            <td 
                                            className='noPaddingleft textAlignCenter'>
                                            {
                                                user.status  ? <>
                                                {
                                                    user.status === "active" ? <div className="xoui verifiedxxx">Active</div>
                                                    :
                                                    user.status === "inactive" ? <div className=" xoui inactive">Inactive</div>
                                                    :
                                                    <div className=" xoui unspecified">
                                                        Suspended
                                                    </div>
                                                }
                                                </> : <div  className='unspecified quedfuuqfhdsc'>Unspecified</div>
                                            }
                                            </td>    
                                            <td className='qsuoe'>
                                                {
                                                    isClick && 
                                                    <div className="suoqrdcs">
                                                        <span 
                                                            onClick={()=>{
                                                                setIsClick(!isClick)
                                                            }}
                                                        className="close">
                                                            <i className='fa-solid fa-xmark'></i>
                                                        </span>
                                                        <button
                                                            onClick={()=>{
                                                                if(user.status !== "active"){
                                                                    handleUpdateStatus(1);
                                                                }
                                                            }}
                                                            className={user.status === "active" ? "activated99 quiodcsx" :"quiodcsx"}
                                                        >
                                                            Active
                                                        </button>
                                                        <button
                                                        onClick={()=>{
                                                            if(user.status !== "inactive"){
                                                                handleUpdateStatus(2);
                                                            }
                                                        }}
                                                            className={user.status === "inactive" ? "activated99 quiodcsx" :"quiodcsx"}
                                                        >
                                                            Inactive
                                                        </button>
                                                        <button
                                                        onClick={()=>{
                                                            if(user.status !== "suspended"){
                                                                handleUpdateStatus(3);
                                                            }
                                                        }}
                                                            className={user.status === "suspended" ? "activated99 quiodcsx" :"quiodcsx"}
                                                        >
                                                            Suspended
                                                        </button>

                                                    </div>
                                                }
                                                <button
                                                    onClick={()=>{
                                                        setIsClick(!isClick);
                                                    }}
                                                >
                                                    <i className='fa-solid fa-pen'></i>&nbsp;&nbsp;Status  
                                                </button>  
                                            </td>                                        
                                        </tr>
    }
    </>
  )
}

export default SingleTr