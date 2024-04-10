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



router.get('/:idRoom', verifyToken,async(req, res)=>{
    try{
        
        const {idRoom} = req.params;

        const isFound = await rooms.findById(idRoom);

        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send("Not found");
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.post('/sendMsg', verifyToken,async(req, res)=>{
    try{
        
        const data = req.body;

        const isCreatedMsg = await messages.create({
            senderId : data.senderId, 
            roomId : data.roomId, 
            message : data.message, 
            sentTo : data.sentTo
        });

        if(isCreatedMsg){
            res.status(200).send(isCreatedMsg);
        }
        else{
            res.status(202).send("Not found");
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});




router.get('/getLastMessage/:ChatEntered' ,verifyToken,async(req, res)=>{
    try{
        
        const {ChatEntered} = req.params;
  
        const isFound = await messages.find({
            roomId : ChatEntered
        }).sort({createdAt : -1});

        let LastMessage = {} ;

        if(isFound){
            if(isFound.length !== 0){
                LastMessage = isFound[0];
                res.status(200).send({
                    LastMessage : LastMessage, 
                    OtherMessages : isFound
                });
            }
            else{
                res.status(202).send("None")
            }
        }
        else{
            res.status(202).send("Not found");
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});







router.post('/markSeenMsg' ,async(req, res)=>{
    try{
        
        const data = req.body;

        const isUpdated = await messages.findOneAndUpdate({
            senderId : data.senderId, 
            roomId : data.roomId, 
            message : data.message
        }, {
            isSeen : true
        }, {new : true});
        console.log("Before ")
        console.log()
        console.log(data);
        console.log()

        console.log("After")
        console.log()

        if(isUpdated){
            console.log(isUpdated)
        }
        else{
            console.log("Not Updated Seen")
        }
        res.status(200).send("Goody");
    }
    catch(e){
        res.status(500).send(e.message);
    }
});




router.get('/getmessages/:idRoom', verifyToken,async(req, res)=>{
    try{
        
        const {idRoom} = req.params;

        const areFound = await messages.find({
            roomId : idRoom
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



router.get('/seenAllMessages/:idRoom', verifyToken,async(req, res)=>{
    try{
        
        const {idRoom} = req.params;
        const idUser = req.user._id;

        const areupdate = await messages.updateMany(
            {
                roomId : idRoom, 
                $nor : [
                    { senderId : idUser }
                ]
            }, 
            {
                $set : {
                    isSeen : true
                }
            }
        );


        if(areupdate){
            res.status(200).send(areupdate);
        }
        else{
            res.status(202).send("Not found");
        }

    }
    catch(e){
        res.status(500).send(e.message);
    }
});




router.get('/getUnseenMessages/:idRoom', verifyToken, async(req, res)=>{
    try{
        
        const {idRoom} = req.params;
        const idUser = req.user._id;

        const areFound = await messages.find({
            isSeen : false, 
            roomId : idRoom, 
            sentTo : idUser
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





router.get('/numberMsgUnseen/:idUser',async(req, res)=>{
    try{
        
        const {idUser} = req.params;

        const areFound = await messages.find(
            {
                sentTo : idUser, 
                isSeen : false
            }
        );


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