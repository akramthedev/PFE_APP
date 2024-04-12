const express = require('express');
const users = require('../Models/users');
const notifs = require('../Models/notifs');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');


const router = express.Router();


router.post('/create' ,async(req, res)=>{
    try{
        const data = req.body;
        const isCreated = await notifs.create(data);
        if(isCreated){
            res.status(200).send(isCreated);
        }
        else{
            res.status(202).send('Not Created...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});

router.post('/wishBirthday' ,async(req, res)=>{
    try{
        const {wisher, wishTo} = req.body;
        const isCreated = await notifs.create({
            type : "Wish Birthday", 
            wisher : wisher, 
            wishTo:  wishTo, 
            idNotifSentTo:  wishTo,
            title : "🎉 Happy Birthday! 🎉", 
            description1 : `${wisher} has wished you a very happy birthday!`
        });
        if(isCreated){
            res.status(200).send(isCreated);
        }
        else{
            res.status(202).send('Not Created...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});




router.get('/updateSeen/:idNotif' ,async(req, res)=>{
    try{
        const {idNotif} = req.params;
        const isUpdated = await notifs.findByIdAndUpdate(idNotif, {
            seen : true
        });
        if(isUpdated){
            res.status(200).send(isUpdated);
        }
        else{
            res.status(202).send('Not Founds...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.get('/getUnseen/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const isFound = await notifs.find({
            idNotifSentTo : idUser, 
            seen : false
        });
        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send([]);
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.get('/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const areFound = await notifs.find({
            idNotifSentTo : idUser
        }).sort({ createdAt: -1 });
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send('Not Founds...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.delete('/:idNotif' ,async(req, res)=>{
    try{
        const {idNotif} = req.params;
        const isDeleted = await notifs.findByIdAndDelete(idNotif);
        if(isDeleted){
            res.status(200).send("The notification deleted successfully!");
        }
        else{
            res.status(202).send('Something went wrong! The notification not deleted..');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});
router.get('/visitedClicked/:idPost' ,async(req, res)=>{
    try{
        const {idPost} = req.params;
        const isUpdated = await notifs.findByIdAndUpdate(idPost, {
            isPostClicked : true
        });
        if(isUpdated){
            res.status(200).send("The notification updated successfully!");
        }
        else{
            res.status(202).send('Something went wrong! The notification not updated..');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.get('/visitedDashboardClicked/:idNotif' ,async(req, res)=>{
    try{
        const {idNotif} = req.params;
        const isUpdated = await notifs.findByIdAndUpdate(idNotif, {
            description2 : ""
        });
        if(isUpdated){
            res.status(200).send("The notification updated successfully!");
        }
        else{
            res.status(202).send('Something went wrong! The notification not updated..');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.delete('/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const { deletedCount } = await notifs.deleteMany({ idNotifSentTo: idUser });
        if (deletedCount > 0) {
            console.log(deletedCount);
            res.status(200).send({ message: `${deletedCount} notifications deleted successfully.` });
          } else {
            console.log(deletedCount);
            res.status(404).send('No notifications found for the given user ID.');
          }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});




module.exports = router;