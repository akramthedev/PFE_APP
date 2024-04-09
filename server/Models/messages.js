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

    
}, {
    timestamps : true
});


module.exports = mongoose.model('messages', Schemax);