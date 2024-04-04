const mongoose = require('mongoose');
const clc = require("cli-color");


const Connect = ()=>{
    mongoose.connect(process.env.MONGODB, {})
    .then(() => {
        console.log(clc.yellow.bold('Connected to MongoDB'));
    })
    .catch((error) => { 
        console.log(clc.red.bold('Connected to MongoDB'));
    });
}


module.exports = Connect;