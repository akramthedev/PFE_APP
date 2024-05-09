const mongoose = require('mongoose');


const Schemax = new mongoose.Schema({

    annoucementX : {
        type : String, 
        required : true
    }
    
}, {
    timestamps : true
});


module.exports = mongoose.model('annoucement', Schemax);