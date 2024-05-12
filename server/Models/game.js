const mongoose = require('mongoose');


const Schemax = new mongoose.Schema({

    player : {
        type : String, 
        required : true, 
    },
    picture : {
        type : String, 
        required : true, 
    },
    fullName : {
        type : String, 
        required : true, 
    },
    score : {
        type : Number, 
        required : true, 
    }
    
}, {
    timestamps : true
});


module.exports = mongoose.model('game', Schemax);