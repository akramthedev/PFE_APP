const express = require('express');
const users = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Helpers/EmailSender');
const notifs = require('../Models/notifs');
const ads = require('../Models/ads');
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




router.get('/choose-plan/:numPlan', verifyToken, async(req, res)=>{
    try{
        
        const {numPlan} = req.params;
        const idUser = req.user._id;
        const isUpdated = await users.findByIdAndUpdate(idUser, {
            plan : numPlan
        }, {new : true});
        if(isUpdated){
            res.status(200).send(isUpdated);
        }
        else{
            res.status(202).send("N");
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
})


router.get('/getPlanOfUserWithToken/:idUser', verifyToken, async (req, res) => {
    try {
        const { idUser } = req.params;

        const isFound = await users.findOne({
            _id: idUser
        });

        if (isFound) {
            res.status(200).send(isFound);
        } else {
            res.status(202).send("N");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});



router.get('/getAllAdsCreatedByUser/:idUser', verifyToken, async (req, res) => {
    try {
        const { idUser } = req.params;

        const areFounds = await ads.find({
            adser: idUser
        });

        if (areFounds) {
            res.status(200).send(areFounds);
        } else {
            res.status(202).send("N");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});


router.get('/delete/:idAds', verifyToken, async (req, res) => {
    try {
        const { idAds } = req.params;

        const isDeleted = await ads.findByIdAndDelete(idAds);

        if (isDeleted) {
            const isUp = await users.findByIdAndUpdate(req.user._id, {
                $inc : {
                    adsNumber : -1
                }
            });
            res.status(200).send("Yes");

        } else {
            res.status(202).send("No");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});



 

const createSingleAd = async (idUser, title, description, image) => {
    const user = await users.findOne({ _id: idUser });
    if (!user) {
        throw new Error('User not found');
    }

    const adsByUser = await ads.find({ adser: idUser });
    const plan = user.plan;
    let maxAds = 0;

    switch (plan) {
        case 1:
            maxAds = 3;
            break;
        case 2:
            maxAds = 5;
            break;
        case 3:
            maxAds = 7;
            break;
        default:
            maxAds = 0;
            break;
    }

    if (adsByUser.length >= maxAds) {
        throw new Error('Maximum ads limit reached for this user');
    }

    const newAd = await ads.create({
        adser: idUser,
        title,
        description,
        image
    });

    await users.findByIdAndUpdate(idUser, { $inc: { adsNumber: 1 } });

    return newAd;
};

// Route to create single ad
router.post('/createSingleAds', verifyToken,  async (req, res) => {
    try {
        const { idUser, title, description, image } = req.body;

        const createdAd = await createSingleAd(idUser, title, description, image);

        res.status(200).json(createdAd);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/deletespecific',verifyToken ,async (req, res)=>{
    try {
       const {idAds,adser} = req.body;
       const isDlete = await ads.deleteOne({_id : idAds});
       await users.findByIdAndUpdate(adser, {
            $inc : {
                adsNumber : -1
            }
       })
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






router.get('/getAllAdsForAdmin', verifyToken, async (req, res) => {
    try {

        const areFound = await ads.find().sort({
            createdAt : -1
        });

        if (areFound) {
            res.status(200).send(areFound);
        } else {
            res.status(202).send("No");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});


router.get('/addClick/:id', verifyToken, async (req, res) => {
    try {

        const {id } = req.params;
        const isFAU = await ads.findByIdAndUpdate(id, {
            $inc : {
                click : 1
            }
        });
        
        if (isFAU) {
            res.status(200).send(isFAU);
        } else {
            res.status(202).send("No");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});







module.exports = router;