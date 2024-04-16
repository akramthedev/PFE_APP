const express = require('express');
const users = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Helpers/EmailSender');
const notifs = require('../Models/notifs');
const ads = require('../Models/ads');
const adsclicks = require('../Models/AdsClicks');
const adsviews = require('../Models/AdsViews');
const nodemailer = require('nodemailer');
const generateRandomNumber = require("../Helpers/generateOTP");
const reqAdsers = require('../Models/reqAdsers');
const verifyToken = require('../Middlewares/verifyToken');
const stripe = require('stripe')('sk_test_51P4dtbJ7Wuh8P9GAJwNYPQlm9hFdWqpj4rJ7XLNRWkvGosNJzwqF2oTfQwuydalaXIvPP94GcenlqIiQxrS4z7Ar00C3GN2mRa');



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




router.get('/choose-plan/:numPlan/:token', verifyToken, async(req, res)=>{
    try{
        
        const {numPlan, token} = req.params;
        const idUser = req.user._id;
        
        

        let name = ""
        let productPrice ;
        if(numPlan === "1"){
            name = "Basic"
            productPrice = 50;
        }
        else if(numPlan === "2"){
            name = "Standard"
            productPrice = 100
        }
        else if(numPlan === "3"){
            name = "Premium"
            productPrice = 299
        }
        

        let line_items = [{
            price_data : {
                currency : "usd", 
                product_data : {
                    name : name, 
                    images : [], 
                }, 
                unit_amount : productPrice * 100
            }, 
            quantity : 1
        }];

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"], 
            line_items : line_items, 
            mode : "payment", 
            success_url:`http://localhost:3000/adser/panel/payment/successfull`, 
            cancel_url : "http://localhost:3000/adser/panel/payment/unsuccessfull"
        });

        if(session){
            await users.findByIdAndUpdate(idUser, {
                plan : numPlan, 
                isPaymentDone : true
            }, {new : true});

            res.status(200).send({
                id : session.id
            })
        }
        else{
            res.status(409).send("Error Stripe...");
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
})


router.get('/upgrade-plan/:numPlan/:token', verifyToken, async(req, res)=>{
    try{
        
        const {numPlan, token} = req.params;
        const idUser = req.user._id;
        
        let name = ""
        let productPrice ;
        if(numPlan === "1"){
            name = "Basic"
            productPrice = 50;
        }
        else if(numPlan === "2"){
            name = "Standard"
            productPrice = 100
        }
        else if(numPlan === "3"){
            name = "Premium"
            productPrice = 299
        }
        

        let line_items = [{
            price_data : {
                currency : "usd", 
                product_data : {
                    name : name, 
                    images : [], 
                }, 
                unit_amount : productPrice * 100
            }, 
            quantity : 1
        }];

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"], 
            line_items : line_items, 
            mode : "payment", 
            success_url:`http://localhost:3000/adser/panel/payment/successfull`, 
            cancel_url : "http://localhost:3000/adser/panel/payment/unsuccessfull"
        });

        if(session){
            await users.findByIdAndUpdate(idUser, {
                plan : numPlan, 
                isPaymentDone : true
            }, {new : true});

            res.status(200).send({
                id : session.id
            })
        }
        else{
            res.status(409).send("Error Stripe...");
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



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


router.get('/fetchSomeAds/:idUser', verifyToken, async (req, res) => {
    try {
        const {idUser} = req.params;
        const areFound = await ads.find({
            adser : {
                $ne : idUser
            }
        });
        if (areFound) {
            if(areFound.length !== 0){
                const shuffledAds = shuffleArray(areFound);
                const twoAdsRandomlyFromTheList = shuffledAds.slice(0, 2);
                res.status(200).send(twoAdsRandomlyFromTheList);
            }
            else{
                res.status(202).send("");
            }
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



 

const createSingleAd = async (idUser, title, description,website, image) => {
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
     }

    const newAd = await ads.create({
        adser: idUser,
        title,
        description,
        image, 
        website
    });

    await users.findByIdAndUpdate(idUser, { $inc: { adsNumber: 1 } });

    return newAd;
};

// Route to create single ad
router.post('/createSingleAds', verifyToken,  async (req, res) => {
    try {
        const { idUser, title, description, image ,website} = req.body;

        const createdAd = await createSingleAd(idUser, title, description,website, image);

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

        const {id} = req.params;
        const isFAU = await adsclicks.create({
            ads : id
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


router.get('/addClick/:id/:idAdser', verifyToken, async (req, res) => {
    try {
        const idOfTheUserWhoClicks = req.user._id;
        const {id, idAdser} = req.params;
        const isFAU = await adsclicks.create({
            ads : id, 
            adser : idAdser
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

router.get('/addViews/:id/:idAdser', verifyToken, async (req, res) => {
    try {
        const idOfTheUserWhoViewd = req.user._id;
        const {id, idAdser} = req.params;
        console.log(idOfTheUserWhoViewd);
        const isFAU = await adsviews.create({
            ads : id, 
            adser : idAdser 
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



router.get('/fetchAdsClick/:idUser', verifyToken, async (req, res) => {
    try {

        const {idUser} = req.params;
        const isFAU = await adsclicks.find({
            adser : idUser
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




router.get('/fetchAdsViews/:idUser', verifyToken, async (req, res) => {
    try {

        const {idUser} = req.params;
        const isFAU = await adsviews.find({
            adser : idUser
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

router.get('/fetchAllViewsHH', async (req, res) => {
    try {

        const isFAU = await adsviews.find();
        
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
