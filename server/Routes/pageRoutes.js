const express = require('express');
const users = require('../Models/users');
const pages = require('../Models/Pages');
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





module.exports = router;