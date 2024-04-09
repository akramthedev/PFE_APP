const express = require('express');
const users = require('../Models/users');
const messages = require('../Models/messages');
const rooms = require('../Models/rooms');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');



const router = express.Router();




router.get('/' ,verifyToken,async(req, res)=>{
    try{
        


    }
    catch(e){
        res.status(500).send(e.message);
    }
});






module.exports = router;