const express = require('express');
const users = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Helpers/EmailSender');
const nodemailer = require('nodemailer');
const generateRandomNumber = require("../Helpers/generateOTP");

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
            const randomNumber = generateRandomNumber();
            const isCreated = await users.create({
                fullName,
                email, 
                password : hashedPassword, 
                otp : randomNumber.toString(), 
                isVerified : false
            });
            if(isCreated){
                await sendEmail(email, randomNumber);
                res.status(200).send(isCreated._id);

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
            if(isFound.status === "suspended"){
                res.status(237).send("Blocked");   
            }
            else{

                const isMatch = await bcrypt.compare(password, isFound.password);

                if(isMatch){
                    if(isFound.isVerified){
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
                        res.status(266).send(isFound._id);
                    }
                }
                else{
                    res.status(202).send('Error');
                }
            }            
        }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});


router.get('/resendotp/:idUser', async(req, res)=>{
    try {
        const randomNumber = generateRandomNumber();
        const {idUser} = req.params;
        const isUpdated = await users.findByIdAndUpdate(idUser,{
            otp : randomNumber.toString(), 
        });
        if(isUpdated){
            sendEmail(isUpdated.email, randomNumber.toString());
            res.status(200).send(isUpdated);
        }
        else{
            res.status(202).send('Oops, something went wrong!');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
})

 
router.post('/verifyOtp', async (req, res) => {
    try {
        const { otp, idUser } = req.body;
        if (!idUser) return res.status(404).send('User Not Found');

        const user = await users.findById(idUser);
        if (!user) return res.status(404).send('User Not Found');
        if (otp !== user.otp) return res.status(400).send('Incorrect OTP');

        const updatedUser = await users.findOneAndUpdate(
            { email: user.email },
            { otp: "666", isVerified: true },
            { new: true }
        );

        if (!updatedUser) return res.status(500).send('Oops, something went wrong while updating!');

        const token = jwt.sign({ _id: updatedUser._id }, process.env.TOKEN_PASS, { expiresIn: "4d" });
        res.status(200).send(token);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;