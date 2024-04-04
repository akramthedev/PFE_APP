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
    isVerified : {
        type : Boolean, 
        default : false
    }

}, {
    timestamps : true
});

module.exports = mongoose.model('users', schemaUsers);