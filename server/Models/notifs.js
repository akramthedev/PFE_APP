const mongoose = require('mongoose');


const notifSchema = new mongoose.Schema({

    title : {
        type : String, 
        required : true
    },
    idNotifSentTo : {
        type : String,
        required : true, 
    },
    description1 : {
        type : String, 
        required : false, 
        default : "",
    },
    description2 : {
        type : String, 
        required : false, 
        default : "",
    },
    description3 : {
        type : String, 
        required : false, 
        default : "",
    },
    description4 : {
        type : String, 
        required : false, 
        default : "",
    },
    description5 : {
        type : String, 
        required : false, 
        default : "",
    },
    type : {
        type : String, 
        required : true, 
        default : "Normal", 
        enum : [
            "Normal",
            "Welcoming",
            "Friend Request", 
            "Friend Accepted", 
            "Friend Rejected", 
            "Comment on Post",
            "Like on Post",
            "Profile Update",
            "New Group Created",
            "Group Deleted",
            "Group Request",
            "Group Accepted",
            "Group Rejected",
            "Group Posted",
            "System Maintenance",
            "Page Followed",
            "Page Posted",
            "Reported User",
            "Event Reminder",
            "Ad Performance Report"
        ]
    },
    idGroup : {
        type : String, 
        required : false
    },
    idPage : {
        type : String, 
        required : false
    },
    idFollowerOfPage : {
        type : String, 
        required : false
    },
    idUserJoinedGroup : {
        type : String, 
        required : false
    },
    eventDate : {
        type : Date, 
        required : false
    },
    UserSentRequest : {
        type : String, 
        required : false
    },
    UserReceivedRequest : {
        type : String, 
        required : false
    },
    UserLikedPost : {
        type : String, 
        required : false
    },
    UserCommentedPost : {
        type : String, 
        required : false
    },
    AdsId : {
        type : String, 
        required : false
    },
    eventName : {
        type : String, 
        required : false
    }
    
}, {
    timestamps : true
});

module.exports = mongoose.model('notifs', notifSchema);