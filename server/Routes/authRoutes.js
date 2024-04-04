const express = require('express');
const users = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const router = express.Router();
 

router.post('/register', async (req, res)=>{
    try {
        const {fullName, email, password} = req.body;
        
        const isEmailFound = await users.findOne({
            email
        });
        if(isEmailFound){
            res.status(201).send('Email already taken.');
        }
        else{
            const saltRound = await bcrypt.genSalt(4);
            const hashedPassword = await bcrypt.hash(password, saltRound);
            const isCreated = await users.create({
                fullName,
                email, 
                password : hashedPassword
            });
            if(isCreated){
                const token = jwt.sign(
                    {
                        _id : isCreated._id, 
                    },
                    process.env.TOKEN_PASS,
                    {
                        expiresIn : "4d"
                    }
                );
                res.status(200).send({
                    token : token, 
                    _id   : isCreated._id,                      
                });
            }
            else{
                res.status(202).send('Oops, something went wrong!');
            }
        }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});

router.post('/login', async (req, res)=>{
    try {
        const {email, password} = req.body;
        const isFound = await users.findOne({
            email
        });
        if(!isFound){
            res.status(204).send('User not existing...');
        }
        else{
            const isMatch = await bcrypt.compare(password, isFound.password);
            if(isMatch){
                const token = jwt.sign(
                    {
                        _id : isFound._id, 
                    },
                    process.env.TOKEN_PASS,
                    {
                        expiresIn : "4d"
                    }
                );
                res.status(200).send({
                    token : token, 
                    _id   : isFound._id,                      
                });
            }
            else{
                res.status(202).send('Error');
            }
        }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});


module.exports = router;