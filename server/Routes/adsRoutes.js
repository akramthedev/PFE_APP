const express = require('express');
const users = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Helpers/EmailSender');
const notifs = require('../Models/notifs');
const nodemailer = require('nodemailer');
const generateRandomNumber = require("../Helpers/generateOTP");
const reqAdsers = require('../Models/reqAdsers');
const verifyToken = require('../Middlewares/verifyToken');



const router = express.Router();
 

router.post('/send-request',verifyToken,async (req, res)=>{
    try {
       const data = req.body;
       const isCreated = await reqAdsers.create({
            applicant   : data.applicant,
            companyName : data.companyName, 
            companyDesc : data.companyDesc, 
            companySite : data.companySite, 
            isForAdults : data.isForAdults
       });
       if(isCreated){
        res.status(200).send(isCreated);
       }
       else{
        res.status(202).send('Oops');
       }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});


router.get('/check/:idUser',verifyToken,async (req, res)=>{
    try {
       const {idUser} = req.params;
       const isFound = await reqAdsers.findOne({applicant : idUser});
       if(isFound){
        if(isFound.length !== 0){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send("sdc");
        }
       }
       else{
        res.status(202).send("sdc");
       }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});


router.delete('/:idrequest',verifyToken,async (req, res)=>{
    try {
       const {idrequest} = req.params;
       const isDlete = await reqAdsers.deleteOne({_id : idrequest});
       if(isDlete){
         res.status(200).send("Deleted");
       }
       else{
        res.status(202).send("sdc");
       }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});

router.get('/getAll',verifyToken,async (req, res)=>{
    try {
       const areFound = await reqAdsers.find();
       if(areFound){
         res.status(200).send(areFound);
       }
       else{
        res.status(202).send("sdc");
       }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});





router.get('/accept-request/:id' ,async(req, res)=>{
    try{
        const {id} = req.params;
        const isFound = await reqAdsers.findOne({
            _id : id
        });
        if(isFound){
            
            await reqAdsers.deleteOne({
                _id : id
            });

            let dataNotification = {
                title: `🔥 Your application for adsers has been accepeted by Admins!`,
                description1: "We're happy to inform you this. Enjoy your new role SIR!",
                idNotifSentTo: isFound.applicant,
                type: "Post Created", 
                idPost : isFound.applicant, 
                isPostClicked : true
            }
            
            await notifs.create(dataNotification); 
            
            const isUpdated = await users.findByIdAndUpdate(isFound.applicant, {
                role : "adser"
            });

            if(isUpdated){
                res.status(200).send('Is updated')
            }
            else{
                res.status(202).send("Not updated");
            }
            
        }
        else{
            res.status(202).send('qs<')
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.get('/reject-request/:id' ,async(req, res)=>{
    try{
        const {id} = req.params;
        

        const isFound = await reqAdsers.findOne({
            _id : id
        });
        if(isFound){
            const isDeleted = await reqAdsers.deleteOne({
                _id : id
            });
            //send notification...
            let dataNotification = {
                title: `❌ Your application for adser role was rejected.`,
                description1: "We are sorry to inform you this. Have a great day!",
                idNotifSentTo: isFound.applicant,
                type: "Post Created", 
                idPost : isFound.applicant, 
                isPostClicked : true
            }
            await notifs.create(dataNotification);            
            if(isDeleted){
                res.status(200).send(isDeleted);
            }
            else{
                res.status(202).send("Not Deleted...");
            }
        }
        else{
            res.status(202).send('Not Founds...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});





module.exports = router;