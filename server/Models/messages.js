const mongoose = require('mongoose');

const Schemax = new mongoose.Schema({

     
    senderId : {
        type : String, 
        required : true
    },
    roomId : {
        type : String, 
        required : true
    },
    message : {
        type : String, 
        required : true
    },
    sentTo : {
        type : String, 
        required : true
    },
    isSeen : {
        type : Boolean, 
        required : false, 
        default : false
    }
}, {
    timestamps : true
});


module.exports = mongoose.model('messages', Schemax);