require('dotenv').config()

const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL,function(err){
  if(err){
    console.log("error occurred while connecting to database");
  }else{
    console.log('connected to server');
  }
});


var contactSchema = mongoose.Schema({
  email:String,
  name:String,
  phone:Number,
  message:String
});

var contact = mongoose.model('contact',contactSchema);


router.get('/contact',function(req,res){
  res.render('contact',{siteTitle:'contact'});
});


var SmtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user:process.env.USER_CONTACT,
        pass:process.env.PASSWORD_CONTACT
    }
});


router.get('/contact/send',function(req,res){

    var mailOptions={
        to : req.query.email,
        bcc:'creativetechlangara@gmail.com',
        subject : 'Contact Form Submission',
        html:`<h2>Dear</h2><p>Thanks for taking the time to contact us. We will get back to you shortly.</p><p>SaveWild.com</p><br><br><hr><br><p>Original message :</p><p>${req.query.message}</p>`
    }

    console.log(mailOptions);
    SmtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});


    var currentCommenter = new contact({
      email:req.query.email,
      name:req.query.name,
      phone:req.query.phone,
      message:req.query.message

    });

    contact.find({},function(err,data){
      console.log("finding all users inside db :" + data +"====================");
    });


console.log('found all ');
    contact.findOne({message:currentCommenter.message},function(err,data){
      if(!data){
        currentCommenter.save(function(err,data){
          if(err){
            console.log('error while saving new commentor');
          }
        });
      }else{
        console.log('comment already exists');
      }
    });


});

module.exports= router;
