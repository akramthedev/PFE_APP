const express = require('express');
const posts = require('../Models/posts');
const users = require('../Models/users');
const notifs = require('../Models/notifs');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');
const axios = require('axios')


const router = express.Router();
console.log('');


router.post('/create', verifyToken, async (req, res) => {
    try {
        const { creator, image, description, type } = req.body;

        console.log("creator : "+creator);
        console.log("image : "+image);
        console.log("description : "+description);
        console.log("type : "+type);

        const pythonServerUrl = 'http://localhost:5000/extract-topics';
        const pythonResponse = await axios.post(pythonServerUrl, { description });

        if (pythonResponse) {
            let topics = pythonResponse.data['eden-ai'].items;

            // Function to generate a random color
            const getRandomColor = () => {
                const colors = [
                    '#7600e5',
                    '#ed4700',
                    '#008200',
                    '#ac009a',
                    '#c00000',
                    '#2b3de2',
                    '#2bd3e2',
                    '#000000',
                    '#ae8000'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            };

            // Add background color to each topic object
            topics.forEach(topic => {
                topic.backgroundColor = getRandomColor();
            });

            const isCreated = await posts.create({
                creator,
                image,
                description,
                type,
                topic: topics
            });

            if (isCreated) {
                let dataNotification = {
                    title: `🚀 Success! Your post has been created!`,
                    description1: "Keep sharing your thoughts and experiences with other people!",
                    idNotifSentTo: creator,
                    type: "Post Created",
                    idPost: isCreated._id
                };

                await notifs.create(dataNotification);
                res.status(200).send(isCreated);
            } else {
                res.status(201).send('Post Not Created ... ');
            }
        } else {
            res.status(404).send('Oops');
        }
    } catch (e) {
        res.status(500).send(e.message);
        console.log(e);
    }
});




router.post('/createPagePost', verifyToken ,async(req, res)=>{
    try{

        const {
            creator,
            image, 
            description, 
            type , 
            isPagePost, 
        } = req.body;

        const pythonServerUrl = 'http://localhost:5000/extract-topics'; // Change if needed
        const pythonResponse = await axios.post(pythonServerUrl, { description });

        if(pythonResponse){
            let topics = pythonResponse.data['eden-ai'].items;

            // Function to generate a random color
            const getRandomColor = () => {
                const colors = [
                    '#7600e5',
                    '#ed4700',
                    '#008200',
                    '#ac009a',
                    '#c00000',
                    '#2b3de2',
                    '#2bd3e2',
                    '#000000',
                    '#ae8000'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            };

            // Add background color to each topic object
            topics.forEach(topic => {
                topic.backgroundColor = getRandomColor();
            });


            const isCreated = await posts.create({
                creator, 
                image, 
                description, 
                type, 
                isPagePost, 
                topic: topics
            });

            if(isCreated){

                let dataNotification = {
                    title: `🎉 Congrats.. Your post was created!`,
                    description1: "You will see it in details in your page!",
                    type: "Friend Accepted", 
                    idNotifSentTo: creator,
                }
                await notifs.create(dataNotification);


                res.status(200).send("Post Created...");
            }
            else{
                res.status(201).send('Post Not Created ... ');
            }
        }
        else{

            const {
                creator,
                image, 
                description, 
                type , 
                isPagePost, 
            } = req.body;

            const isCreated = await posts.create({
                creator, 
                image, 
                description, 
                type, 
                isPagePost, 
            });

            if(isCreated){

                let dataNotification = {
                    title: `🎉 Congrats.. Your post was created!`,
                    description1: "You will see it in details in your page!",
                    type: "Friend Accepted", 
                    idNotifSentTo: creator,
                }
                await notifs.create(dataNotification);


                res.status(200).send("Post Created...");
            }
            else{
                res.status(201).send('Post Not Created ... ');
            }
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







router.get('/', verifyToken, async (req, res) => {
    try {
        const idUser = req.user._id;

        // Récupérer les pages suivies par l'utilisateur
        const user = await users.findById(idUser).select('pages');

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Créer un tableau des IDs de pages suivies
        const pageIds = user.pages.map(page => page._id);

        // Requête unique pour récupérer tous les posts
        const allPosts = await posts.find({
            $or: [
                { isPagePost: false }, // Posts de l'utilisateur
                { isPagePost: true, creator: { $in: pageIds } } // Posts des pages suivies
            ]
        }).sort({ createdAt: -1 });

        if (allPosts.length === 0) {
            return res.status(404).send('Posts not found');
        }

        res.status(200).send(allPosts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


 


router.post('/addComment' ,async(req, res)=>{
    try{
        const {
            idPost, commentator, comment
        } = req.body;

        const isFoundAndUpdated = await posts.findByIdAndUpdate(idPost,{
            $push : {
                comments : {commentator : commentator,comment : comment }
            }
        });

        if(isFoundAndUpdated){
            res.status(200).send(isFoundAndUpdated);
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