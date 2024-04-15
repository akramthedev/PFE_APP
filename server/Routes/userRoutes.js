const express = require('express');
const users = require('../Models/users');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');
const posts = require('../Models/posts');
const ads = require('../Models/ads');
const router = express.Router();





router.get('/:id', verifyToken ,async(req, res)=>{
    try{
        const {id} = req.params;
        const isFound = await users.findById(id);
        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.get('/updateBookMark/:idUser/:idPost', verifyToken ,async(req, res)=>{
    try{
        const {idUser, idPost} = req.params;
        const isFound = await users.findById(idUser);

        if(isFound){
            if(isFound.bookmarks.includes(idPost)){
                await users.findByIdAndUpdate(idUser, {
                    $pull : {
                        bookmarks : idPost
                    }
                });
            }
            else{
                await users.findByIdAndUpdate(idUser, {
                    $push : {
                        bookmarks : idPost
                    }
                });
            }
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.post('/updateStatus' ,async(req, res)=>{
    try{
        const {status, userId} = req.body;
        const isFound = await users.findByIdAndUpdate(userId, {
            status : status
        }, {new : true});
        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.get('/', verifyToken ,async(req, res)=>{
    try{
        const areFound = await users.find();
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.post('/getSomeInfos', verifyToken ,async(req, res)=>{
    try{

        let usersLength = -1;
        let postsLength = -1;
        let adsviewsLength = -1;

        const areFound = await users.find();
        if(areFound){
            usersLength = areFound.length;
            const areFound2 = await posts.find();
            if(areFound2){
                postsLength = areFound2.length;
                const allAds = await ads.find();
                if(allAds && allAds.length !== 0){
                    let size = 0;
                    for(let i = 0;i<allAds.length;i++){
                        size = size + allAds[i].views
                    }
                    adsviewsLength = size;
                    res.status(200).send({
                        usersLength : usersLength, 
                        postsLength : postsLength, 
                        adsviewsLength : adsviewsLength
                    })
                }
                else{
                    res.status(202).send('JJQJDC');
                }
            }
            else{
                res.status(202).send('Not Found...');
            }
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/getAllUsersSize', verifyToken ,async(req, res)=>{
    try{
        const areFound = await users.find();
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});




router.post('/updateinfos', verifyToken ,async(req, res)=>{
    try{
        const {
            idUser ,
            fullName , 
            bio  ,
            BigAbout , 
            address , 
            dateOfBirth , 
            phoneNumber  ,
            portfolio 
        } = req.body;
        
        const idToken = req.user._id

        if(idToken === idUser){
            const isUpdated = await users.findByIdAndUpdate(idUser, {
                fullName, 
                bio,
                BigAbout, 
                address, 
                dateOfBirth, 
                phoneNumber,
                portfolio 
            }, {new : true});
            if(isUpdated){
                res.status(200).send(isUpdated);
            }
            else{
                res.status(202).send('Not Found...');
            }
        }
        else{
            res.status(401).send("Not Authentified...")
        }
        
    }
    catch(e){
        res.status(500).send(e.message);
    }
});

router.post('/updateBigAbout', verifyToken ,async(req, res)=>{
    try{
        const {
            idUser,
            BigAbout, 
        } = req.body;
        
        const idToken = req.user._id

        if(idToken === idUser){
            const isUpdated = await users.findByIdAndUpdate(idUser, {
                BigAbout
            }, {new : true});
            if(isUpdated){
                res.status(200).send(isUpdated);
            }
            else{
                res.status(202).send('Not Found...');
            }
        }
        else{
            res.status(401).send("Not Authentified...")
        }
        
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



 

module.exports = router;