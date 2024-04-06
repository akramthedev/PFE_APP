const express = require('express');
const users = require('../Models/users');
const requests = require('../Models/requests');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');


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
            sentTo : idUser
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