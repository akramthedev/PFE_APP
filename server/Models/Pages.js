const mongoose = require('mongoose');


const pagesSchema = new mongoose.Schema({

    creator : {
        type : String, 
        required : true
    },
    profilePic: {
        type: String,
        default: 'https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png' 
    },
    coverPic: {
        type: String,
        default: 'https://live.staticflickr.com/3745/10353673376_ec7a400972_b.jpg' 
    },

    description : {
        type : String, 
        required : false
    },
    website : {
        type : String,
        required : false
    },
    followers :  [String], 
    
}, {
    timestamps : true
});

module.exports = mongoose.model('pages', pagesSchema);