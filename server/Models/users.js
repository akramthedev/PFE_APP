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
        default: 'https://wallpaperswide.com/download/stars_galaxies-wallpaper-2560x1440.jpg' 
    },
    bio: {
        type: String,
        default: '',
    },
    BigAbout :{
        type : String, 
        required : false, 
        default : "",
    },
    address: {
        type : String, 
        required : false, 
        default : "", 
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
    plan: {
        type: Number,
        required : false, 
        enum : [1, 2, 3]
    },
    isVerified : {
        type : Boolean, 
        default : false
    },
    MBTI : {
        type : String, 
        default : "none", 
        required : false
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
    isPaymentDone : {
        type : Boolean, 
        required : false, 
        default : false
    },
    adsNumber : {
        type : Number, 
        required : false, 
        default : 0
    },
    otp : {
        type : String, 
        required : false
    },
    adsSeen : {
        type : [{
            ads : String, 
            count : Number
        }], 
        required : false
    }
    
}, {
    timestamps : true
});

module.exports = mongoose.model('users', schemaUsers);