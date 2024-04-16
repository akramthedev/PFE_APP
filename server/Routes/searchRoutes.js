const express = require('express');
const users = require('../Models/users');
const pages = require('../Models/Pages');

const router = express.Router();


router.get('/:search/:idUser',async (req, res)=>{
    try {
        const {search, idUser} = req.params;
        const searchRegex = new RegExp(search, 'i');

        const userResults = await users.find({ 
            _id : { $ne : idUser }, 
            $or: [{ fullName: { $regex: searchRegex } }, { email: { $regex: searchRegex } }]
        });

        const pageResults = await pages.find({
            $or: [{ name: { $regex: searchRegex } }, { description: { $regex: searchRegex } }]
        });

        res.status(200).send({
            users: userResults,
            pages: pageResults
        });

    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});



module.exports = router;