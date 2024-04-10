const express = require('express');
const users = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Helpers/EmailSender');
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





module.exports = router;