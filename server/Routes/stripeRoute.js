const stripe = require('stripe')('sk_test_51P4dtbJ7Wuh8P9GAJwNYPQlm9hFdWqpj4rJ7XLNRWkvGosNJzwqF2oTfQwuydalaXIvPP94GcenlqIiQxrS4z7Ar00C3GN2mRa');
const ads = require('../Models/ads');
const express = require('express');
const users = require('../Models/users');
const verifyToken = require('../Middlewares/verifyToken');


const router = express.Router();


router.get('/getTurnover',verifyToken,async (req, res)=>{
    try {
        let totalAmount = 0;
        const payments = await stripe.paymentIntents.list({ limit: 500 });
        
        if(payments){
            payments.data.forEach(payment => {
                if (payment.status === 'succeeded') {  
                  totalAmount += payment.amount;
                }
            });
            res.status(200).send({
                totalAmount : totalAmount, 
                payments : payments
            });
        }
        else{
            res.status(202).send('Oops');
        }
        
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});



module.exports = router;