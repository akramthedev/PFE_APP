const mongoose = require('mongoose');


const postsSchema = new mongoose.Schema({

    creator : {
        type : String, 
        required : true
    },
    image : {
        type : String, 
        required : false
    },
    description : {
        type : String, 
        required : false
    },
    type : {
        type : String, 
        default : "normal", 
        enum : ['normal', "feelings", "ads", "suggestusers", "others", "notice"]
    }, 
    likes :  [String], 
    comments : [{
        commentator : String, 
        comment : String
    }], 
    views : {
        type : Number, 
        default : 0
    }, 
    
}, {
    timestamps : true
});

module.exports = mongoose.model('posts', postsSchema);