const mongoose = require('mongoose');

const Schemax = new mongoose.Schema({

    member1 : {
        type : String, 
        required : true, 
    },
    member2 : {
        type : String, 
        required : true, 
    },
    otherMembers : {
        type : [String], 
        required : false, 
    },
    picture : {
        type : String, 
        required : false,
        default : ""
    }, 
    groupId : {
        type : String, 
        default : "",
        required : false, 
    }
    
}, {
    timestamps : true
});


module.exports = mongoose.model('rooms', Schemax);