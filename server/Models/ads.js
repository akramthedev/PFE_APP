const mongoose = require('mongoose');

const Schemax = new mongoose.Schema({

    title : {
        type : String, 
        required : true, 
    }, 
    description : {
        type : String, 
        required : true,
    },
    image : {
        type : String, 
        required : true,
    },
    adser : {
        type : String, 
        required : true
    },
    click : {
        type : Number, 
        required : false, 
        default : 0
    }, 
    
    views : [
        {
            idUser : String, 
            seenByIdUser : Number
        }
    ]
    
}, {
    timestamps : true
});


module.exports = mongoose.model('ads', Schemax);