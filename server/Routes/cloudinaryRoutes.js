const express = require('express');
const users = require('../Models/users');


const cloudinary = require("cloudinary").v2;
const Multer = require("multer");


require('dotenv').config();

const router = express.Router();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
}


const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});



router.post("/uploadProfilePicture/:idUser", upload.single("my_file"), async (req, res) => {
    try {
        const {idUser} = req.params; 
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);

      await users.findByIdAndUpdate(idUser, {
        profilePic : cldRes.url
      });

      res.status(200).send(cldRes);
    } catch (error) {
      console.log(error);
      res.send({
        message: error.message,
      });
    }
});




router.post("/uploadProfileCover/:idUser", upload.single("my_file2"), async (req, res) => {
    try {

        const {idUser} = req.params; 
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);

      await users.findByIdAndUpdate(idUser, {
        coverPic : cldRes.url
      });

      res.status(200).send(cldRes);
    } catch (error) {
      console.log(error);
      res.send({
        message: error.message,
      });
    }
});


router.post("/uploadCreatePost", upload.single("my_file"), async (req, res) => {
  try {

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.status(200).send(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
});












module.exports = router;