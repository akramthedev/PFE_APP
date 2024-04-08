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

router.post('/followthepage' ,verifyToken,async(req, res)=>{
    try{
        const {idFollower, idPageLiked} = req.body;
        
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





module.exports = router;