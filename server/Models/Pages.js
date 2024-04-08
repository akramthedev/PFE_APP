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
        default: 'https://res.cloudinary.com/dqprleeyt/image/upload/v1712553459/Design_sans_titre_3_fblwgn.png' 
    },
    isVerified : {
        type : Boolean, 
        default : false, 
        required : false
    },
    followers :  [String], 
    PostingStatus : {
        type : String, 
        required : false, 
        enum : ["Every Day", "Every Week", "Every Month"]
    },
    likes :  [String], 
}, {
    timestamps : true
});

module.exports = mongoose.model('pages', pagesSchema);

