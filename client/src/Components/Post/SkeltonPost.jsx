import React from 'react'
import "./Post.css";


const SkeltonPost = () => {
  return (
    <div className="PostSkelton">
                    <div className="rowContent">
                      <div className="imgSkelton" />
                      <div className="fullNameSkelton" />
                    </div>
                    <div className="rowContent2">
                      <div className="fullNameSkelton" />
                      <div className="DescriptionSkelton" />
                    </div>
                    <div className="rowContent2">
                      <div className="fullNameSkelton" />
                      <div className="DescriptionSkelton DescriptionSkelton2" />
                    </div>
                  </div>
  )
}

export default SkeltonPost