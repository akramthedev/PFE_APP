const express = require('express');
const users = require('../Models/users');
const pages = require('../Models/Pages');
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





module.exports = router;