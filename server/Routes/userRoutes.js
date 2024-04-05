const express = require('express');
const users = require('../Models/users');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');

const router = express.Router();


router.get('/:id', verifyToken ,async(req, res)=>{
    try{
        const {id} = req.params;
        const isFound = await users.findById(id);
        if(isFound){
            res.status(200).send(isFound);
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



module.exports = router;