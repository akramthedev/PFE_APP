const express = require('express');
const users = require('../Models/users');
const notifs = require('../Models/notifs');
const pages = require('../Models/Pages');
const posts = require('../Models/posts');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');



const router = express.Router();


router.post('/create' ,verifyToken,async(req, res)=>{
    try{
        const data = req.body;
        const isCreated = await pages.create(data);
        if(isCreated){
            const isUpdatedUser = await users.findByIdAndUpdate(data.creator, {
                $push : {
                    pages : isCreated._id
                }
            }, {new : true});
           if(isUpdatedUser){
                let dataNotification = {
                    title: `🎉 Congrats.. Your page is now alive!`,
                    description1: "You will see it in your left navigation bar.",
                    type: "Friend Accepted", 
                    idNotifSentTo: data.creator,
                }
                await notifs.create(dataNotification);
                res.status(200).send(isUpdatedUser);
           }
           else{
            res.status(202).send("");
           }
        }
        else{
            res.status(202).send('Not Created...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/:idPage' ,verifyToken,async(req, res)=>{
    try{
        const {idPage} = req.params;
        const isFound = await pages.findById(idPage);
        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('Not found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.post('/likethepage' ,verifyToken,async(req, res)=>{
    try{
        const {idLiker, idPageLiked} = req.body;

        const isFound = await pages.findById(idPageLiked);
        if(isFound){
            if(isFound.likes.includes(idLiker)){
                await pages.findByIdAndUpdate(idPageLiked, {
                    $pull : {
                        likes : idLiker
                    }
                })
                res.status(200).send("disliked");
            }
            else{
                await pages.findByIdAndUpdate(idPageLiked, {
                    $push : {
                        likes : idLiker
                    }
                })
                res.status(200).send("Liked");

            }
        }
        else{
            res.status(202).send('Not found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});

router.post('/followThePage' ,verifyToken,async(req, res)=>{
    try{
        const {idFollower, idPageFollowed} = req.body;
        
        const isFound = await pages.findById(idPageFollowed);
        if(isFound){
            if(isFound.followers.includes(idFollower)){
                await pages.findByIdAndUpdate(idPageFollowed, {
                    $pull : {
                        followers : idFollower
                    }
                });
                await users.findByIdAndUpdate(idFollower, {
                    $pull : {
                        pages : idPageFollowed
                    }
                });
                res.status(200).send("disFollowed");
            }
            else{
                await pages.findByIdAndUpdate(idPageFollowed, {
                    $push : {
                        followers : idFollower
                    }
                })
                await users.findByIdAndUpdate(idFollower, {
                    $push : {
                        pages : idPageFollowed
                    }
                });
                let dataNotification = {
                    title: `✔️ You've started following ${isFound.name}!`,
                    description1: "Any post created by this page, you'll see it in your home page.",
                    type: "Friend Accepted", 
                    idNotifSentTo: idFollower,
                }
                await notifs.create(dataNotification);

                res.status(200).send("Followed");
            }
        }
        else{
            res.status(202).send('Not found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.post('/verification-page-data' , verifyToken , async(req, res)=>{
    try{
        const {
            idPage, 
            idUser
        } = req.body;
        
        const isFound = await pages.findById(idPage);
        if(isFound){
            if(isFound.isVerified){
                res.status(202).send('Already Verified...');
            }
            else{
                if(isFound.creator === idUser){
                    const allPosts = await posts.find({
                        creator : idPage
                    });
                    if(allPosts && allPosts.length !== 0){
                        
                        let totalViewsOfAllPosts    =  0;
                        let totalLikesOfAllPosts    =  0;
                        let totalCommentsOfAllPosts =  0;
                        let totalFollowers          =  0;
                        let totalLikesOfThePage     =  0;
                        let totalPosts              =  0;
                        
                        for(let i = 0; i < allPosts.length;i++){
                            totalViewsOfAllPosts += allPosts[i].views;
                            totalLikesOfAllPosts += allPosts[i].likes.length;
                            totalCommentsOfAllPosts += allPosts[i].comments.length;
                        }
    
                        totalFollowers       =  isFound.followers.length;
                        totalLikesOfThePage  =  isFound.likes.length;
                        totalPosts           =  allPosts.length;
    
                        const viewsThreshold            =   1000;  
                        const likesThreshold            =   500;  
                        const commentsThreshold         =   200;  
                        const allPostsLengthThreshold   =   10;  
                        const followersThreshold        =   300;  
                        const pageLikesThreshold        =   400;

                        if(
                            totalViewsOfAllPosts >= viewsThreshold &&
                            totalLikesOfAllPosts >= likesThreshold &&
                            totalCommentsOfAllPosts >= commentsThreshold &&
                            totalFollowers >= followersThreshold &&
                            totalLikesOfThePage >= pageLikesThreshold &&
                            totalPosts >= allPostsLengthThreshold
                        ){
                            //update the verification
                            const isUpdated = await pages.findByIdAndUpdate(idPage, {
                                isVerified : true
                            }, {new : true});
                            if(isUpdated){
                                let dataNotification = {
                                    title: `✨ Congrats! Your page is now verified by Xplorium.`,
                                    description1: "Keep sharing your thoughts and experiences with other people!",
                                    idNotifSentTo: isFound.creator,
                                    type: "Post Created", 
                                    idPost :  isFound._id
                                }
                                await notifs.create(dataNotification);
                                res.status(200).send(isUpdated);
                            }
                            else{
                                res.status(666).send('nO TuPDATED');
                            }
                        }
                        else{
                            res.status(202).send("quo<s");
                        }
                    }
                    else{
                        res.status(202).send('Not The Creator...');
                    }
                }   
                else{
                    res.status(202).send('Not The Creator...');
                }
            }
        }
        else{
            res.status(202).send('Not found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});





module.exports = router;