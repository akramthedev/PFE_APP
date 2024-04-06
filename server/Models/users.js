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
    profilePic: {
        type: String,
        default: 'https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png' 
    },
    coverPic: {
        type: String,
        default: 'https://live.staticflickr.com/3745/10353673376_ec7a400972_b.jpg' 
    },
    bio: {
        type: String,
        default: '',
    },
    address: {
        type : String, 
        required : false
    },
    phoneNumber: {
        type: String,
        required: false, 
        default: "", 
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'inactive'],
        default: 'active'
    },
    portfolio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'user',  
        enum: ['user', 'admin', 'adser']  
    },
    isVerified : {
        type : Boolean, 
        default : false
    },
    contacts: [],
    pages : [], 
    groups : [],
    bookmarks : [], 
    attemptstoConnect : {
        type : Number, 
        required : false, 
        default : 0
    },
    otp : {
        type : String, 
        required : false
    },
    
}, {
    timestamps : true
});

module.exports = mongoose.model('users', schemaUsers);