const mongoose = require('mongoose');


const pagesSchema = new mongoose.Schema({

    creator : {
        type : String, 
        required : true
    },
    name : {
        type : String, 
        required : true
    },
    description : {
        type : String, 
        required : false
    },
    website : {
        type : String,
        required : false
    },
    isForAdults : {
        type : String, 
        required : true, 
        default : true
    },
    profilePic: {
        type: String,
        default: 'https://res.cloudinary.com/dqprleeyt/image/upload/v1712275985/logo_d0yjmq.png' 
    },
    coverPic: {
        type: String,
        default: 'https://t3.ftcdn.net/jpg/03/00/27/06/360_F_300270690_LBzP8uPqlImoYzvuaBvmV0X7NIyjLTuW.jpg' 
    },

    followers :  [String], 
    
}, {
    timestamps : true
});

module.exports = mongoose.model('pages', pagesSchema);

