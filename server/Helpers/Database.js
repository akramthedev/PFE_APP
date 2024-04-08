const mongoose = require('mongoose');
const clc = require("cli-color");


const Connect = ()=>{
    mongoose.connect(process.env.MONGODB, {})
    .then(() => {
        console.log(clc.magenta.bold('Connected to MongoDB'));
    })
    .catch((error) => { 
        console.log(clc.red.bold('DisConnected from MongoDB'));
        console.log(clc.red.bold(error));        
    });
}


module.exports = Connect;