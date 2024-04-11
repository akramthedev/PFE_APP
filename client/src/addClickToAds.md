 const addClick = async(id)=>{
    if(token){
      try{
       await axios.get(`http://localhost:3001/ads/addClick/${id}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
      } 
      catch(error){
      }
    }
  }
