const express = require('express');
const posts = require('../Models/posts');
const users = require('../Models/users');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');


const router = express.Router();


router.post('/create', verifyToken ,async(req, res)=>{
    try{
        const {
            creator,
            image, 
            description, 
            type 
        } = req.body;

        const isCreated = await posts.create({
            creator, 
            image, 
            description, 
            type
        });
        if(isCreated){
            res.status(200).send("Post Created...");
        }
        else{
            res.status(201).send('Post Not Created ... ');
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/:id' ,async(req, res)=>{
    try{
        const {
            id
        } = req.params;

        const isFound = await posts.findById(id);

        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(201).send('Post Not Found ... ');
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.delete('/:id' ,async(req, res)=>{
    try{
        const {
            id
        } = req.params;

        const isDeleted = await posts.findByIdAndDelete(id);

        if(isDeleted){
            res.status(200).send("Is Deleted successfully ! ");
        }
        else{
            res.status(201).send('Post Not deleted ... ');
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/addView/:id' ,async(req, res)=>{
    try{
        const {
            id
        } = req.params;

        const isUpdated = await posts.findByIdAndUpdate(id, {
            $inc : {
                views : 1
            }
        }, { new: true });

        if(isUpdated){
            res.status(200).send(isUpdated);
        }
        else{
            res.status(201).send('Post Not Found ... ');
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/user/:iduser' ,async(req, res)=>{
    try{
        const {
            iduser
        } = req.params;

        const areFound = await posts.find({
            creator : iduser
        }).sort({createdAt:-1});

        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(201).send('Post Not Found ... ');
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/likeProcess/:idPost',verifyToken,async(req, res)=>{
    try{
        const {
            idPost
        } = req.params;
        const idUser = req.user._id

        const isFound = await posts.findById(idPost);

        if(isFound){
            if(isFound.likes.includes(idUser)){
                //pull
                await posts.findByIdAndUpdate(idPost, {
                    $pull : {
                        likes : idUser
                    }
                })
                res.status(200).send("Jack");
            }
            else{
                await posts.findByIdAndUpdate(idPost, {
                    $push : {
                        likes : idUser
                    }
                })
                res.status(200).send("Jack");
            }
        }
        else{
            res.status(201).send('Post Not Found ... ');
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/' ,async(req, res)=>{
    try{

        const areFound = await posts.find().sort({ createdAt: -1 });

        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(201).send('Post Not Found ... ');
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});





module.exports = router;