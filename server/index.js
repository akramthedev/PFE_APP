const express       =  require('express');
const mongoose      =  require('mongoose');
const cors          =  require('cors');
const clc           =  require("cli-color");
const Connect       =  require('./Helpers/Database');
const authRoutes    =  require('./Routes/authRoutes');


require('dotenv').config();
const app = express();
app.set('trust proxy', true);   
app.use(express.json());
app.use(cors());
app.listen(process.env.PORT, ()=>{
    console.log(clc.magenta.bold("Connected to Server"));
    Connect();
});


app.use('/auth', authRoutes);