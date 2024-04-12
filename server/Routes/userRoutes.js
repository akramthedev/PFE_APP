const express = require('express');
const users = require('../Models/users');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');



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




router.post('/updateinfos', verifyToken ,async(req, res)=>{
    try{
        const {
            idUser ,
            fullName , 
            profilePic  , 
            coverPic ,
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
                profilePic, 
                coverPic,
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
