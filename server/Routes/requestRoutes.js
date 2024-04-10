const express = require('express');
const users = require('../Models/users');
const requests = require('../Models/requests');
const notifs = require('../Models/notifs');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');
const rooms = require('../Models/rooms');




const router = express.Router();


router.post('/create' ,async(req, res)=>{
    try{
        const data = req.body;
        const isCreated = await requests.create(data);
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




router.post('/checking', async (req, res) => {
    try {
        const { currentId, idVisited } = req.body;

        const request = await requests.findOne({
            $or: [
                { sender: currentId, sentTo: idVisited },
                { sender: idVisited, sentTo: currentId }
            ]
        });

        if (request) {
            res.status(200).send(request);
        } else {
            res.status(202).send('Request not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




router.post('/accept', async (req, res) => {
    try {
        const { sender, sentTo } = req.body;

        const request = await requests.findOne({
            sender: sender,
            sentTo: sentTo
        });

        if (request) {
            // Remove the request
            await requests.deleteOne({
                sender: sender,
                sentTo: sentTo
            });

            // Update user 1
            const isUser1Updated = await users.findByIdAndUpdate(sender, {
                $push: {
                    contacts: sentTo
                }
            });


            // Update user 2
            const isUser2Updated = await users.findByIdAndUpdate(sentTo, {
                $push: {
                    contacts: sender
                }
            });


            if (isUser1Updated && isUser2Updated) {
                let data1 = {
                    title : `🎉 Congratulations! You and ${isUser1Updated.fullName} are now friends!`, 
                    description1 : "Start chatting, sharing, and enjoying your friendship together!", 
                    type : "Friend Accepted", 
                    idNotifSentTo : sentTo
                }
                let data2 = {
                    title : `🎉 Congratulations! You and ${isUser2Updated.fullName} are now friends!`, 
                    description1 : "Start chatting, sharing, and enjoying your friendship together!",
                    idNotifSentTo :  sender,
                    type : "Friend Accepted", 
                }
                
                await notifs.create(data1);
                await notifs.create(data2);

                //creating of a room for them 
                const isFound = await rooms.find({
                    $or: [
                        { member1: sender, member2: sentTo },
                        { member1: sentTo, member2: sender }
                    ]
                });
                if(isFound.length === 0){
                    await rooms.create({
                        member1 : sender, 
                        member2 : sentTo
                    });
                }
                res.status(200).send("GOOD");
            } else {
                res.status(202).send("OOpsy");
            }
        } else {
            res.status(202).send('Request not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});





router.get('/updateSeen/:idrequest' ,async(req, res)=>{
    try{
        const {idrequest} = req.params;
        const isUpdated = await requests.findByIdAndUpdate(idrequest, {
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





router.post('/reject', async (req, res) => {
    try {
        const { sender, sentTo } = req.body;

        await requests.deleteOne({
            sender : sender, 
            sentTo : sentTo
        });
        console.log(sender +"   " +sentTo)
        
        res.status(200).send("Deleted...");
         
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




router.post('/remove', async (req, res) => {
    try {
        const { sender, sentTo } = req.body;

        const isUser1Updated = await users.findByIdAndUpdate(sender, {
            $pull: {
                contacts: sentTo
            }
        });

        // Update user 2
        const isUser2Updated = await users.findByIdAndUpdate(sentTo, {
            $pull: {
                contacts: sender
            }
        });

        if (isUser1Updated && isUser2Updated) {
            res.status(200).send("GOOD");
        } else {
            res.status(202).send("OOpsy");
        }
         
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});






router.get('/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const areFound = await requests.find({
            sentTo : idUser, 
        }).sort({ createdAt: -1 }); 
        if(areFound){
            res.status(200).send(areFound);
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
        const areFound = await requests.find({
            sentTo : idUser, 
        }).sort({ createdAt: -1 }); 
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send([]);
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.get('/getNumberUnseen/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const areFound = await requests.find({
            sentTo : idUser, 
            seen : false
        }); 
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send([]);
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.delete('/:idRequest' ,async(req, res)=>{
    try{
        const {idRequest} = req.params;
        const isDeleted = await requests.findByIdAndDelete(idRequest);
        if(isDeleted){
            res.status(200).send(isDeleted);
        }
        else{
            res.status(202).send('Not Founds...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.delete('/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const { deletedCount } = await requests.deleteMany({ sentTo: idUser });
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