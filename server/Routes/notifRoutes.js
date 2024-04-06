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




router.get('/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const areFound = await notifs.find({
            idNotifSentTo : idUser
        });
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