const mongoose = require('mongoose');


const schemaUsers = new mongoose.Schema({

    fullName : {
        type : String, 
        required : true
    },
    email : {
        type : String, 
        required : true
    },
    password : {
        type : String, 
        required : true
    },
    otp : {
        type : String, 
        required : false
    },
    isVerified : {
        type : Boolean, 
        default : false
    },
    profilePic: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg' 
    },
    coverPic: {
        type: String,
        default: 'https://live.staticflickr.com/3745/10353673376_ec7a400972_b.jpg' 
    },
    role: {
        type: String,
        default: 'user',  
        enum: ['user', 'admin', 'moderator']  
    },
    phoneNumber: {
        type: String,
        required: false,  
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    address: {
        type : String, 
        required : false
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'inactive'],
        default: 'active'
    },
    friends: [],
    bio: {
        type: String,
        default: '',
    },
}, {
    timestamps : true
});

module.exports = mongoose.model('users', schemaUsers);