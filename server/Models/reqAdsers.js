
const mongoose = require('mongoose');

const Schemax = new mongoose.Schema({

    
    applicant : {
        type : String, 
        required : true
    },
    companyName : {
        type : String, 
        required : true
    },
    companyDesc : {
        type : String, 
        required : true
    },
    companySite : {
        type : String, 
        required : false
    },
    isForAdults : {
        type : Boolean, 
        required : true
    },
    


}, {
    timestamps : true
});


module.exports = mongoose.model('reqAdsers', Schemax);