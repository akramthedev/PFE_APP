const express = require('express');
const users = require('../Models/users');
const messages = require('../Models/messages');
const rooms = require('../Models/rooms');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');


const router = express.Router();




router.get('/allRoomsPerUser/:idUser', verifyToken,async(req, res)=>{
    try{
        
        const {idUser} = req.params;

        const areFound = await rooms.find({
            $or: [
                { member1: idUser},
                { member2: idUser}
            ]
        });

        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send("Not found");
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});





module.exports = router;