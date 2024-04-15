import React, {useState, useEffect, createRef} from 'react'
import axios from 'axios';




const Cloudinary = () => {
  
    const [file, setFile] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const [res, setRes] = useState({});
    
    const handleSelectFile = (e) => setFile(e.target.files[0]);
    


    const handleUpload = async () => {
        try {
            setLoading2(true);
            const data = new FormData();
            data.append("my_file", file);
            const res = await axios.post("http://localhost:3001/cloudinary/upload", data);
            if(res){
                setRes(res.data);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading2(false);
        }
    };


    return (
        <div className='Cloudinary' >
            Cloudinary Upload
            <br />
            <label htmlFor="file" className="btn-grey">
                {" "}
                select file
            </label>
            {file && <center> {file.name}</center>}
            <input
                id="file"
                type="file"
                onChange={handleSelectFile}
                multiple={false}
            />
            <code>
                {Object.keys(res).length > 0
                ? Object.keys(res).map((key) => (
                    <p className="output-item" key={key}>
                        <span>{key}:</span>
                        <span>
                        {typeof res[key] === "object" ? "object" : res[key]}
                        </span>
                    </p>
                    ))
                : null}
            </code>
            {file && (
                <>
                <button onClick={handleUpload} className="btn-green">
                    {loading2 ? "uploading22..." : "upload to cloudinary"}
                </button>
                </>
            )}
        </div>
    )
}

export default Cloudinary