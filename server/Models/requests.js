const mongoose = require('mongoose');


const RequestsSchema = new mongoose.Schema({

    sender : {type : String, required : true},
    sentTo : {type : String, required : true},
    type : {
        type : String, 
        required : true, 
        default : "twoPeople", 
        enum : ['twoPeople', 'groupPeople']
    }, 
    seen : {
        type : Boolean, 
        default : false
    }
    
}, {
    timestamps : true
});

module.exports = mongoose.model('requests', RequestsSchema);