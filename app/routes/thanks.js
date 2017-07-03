const path = require('path');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport({
    service: "gmail",
  host: "smtp.gmail.com",
  auth: {
      user: "creativetechlangara",
      pass: "Project2"
  }
});


router.get('/thanks',function(req,res){
  res.render('thanks',{siteTitle : 'thanks'});
});

router.post('/thanks',function(req,res){
console.log(smtpTransport);
  let mailOptions={
      to : req.body.Email,
      subject : "thanks for donations ANOTHER",
      html:req.query.Donation,
      attachments:[
        {   // use URL as an attachment
          filename: 'license.txt',
          path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        }
      ]
  }

  smtpTransport.sendMail(mailOptions,function(error,message){

    if(error){
      var mailDelivered =false;
    }else{
      var mailDelivered = true;
      console.log("mail is delivered");
    }

      res.render('thanks',{
        siteTitle:'thanks',
        name: req.body.firstName,
        email: req.body.Email,
        delivered : mailDelivered });
  });

});


module.exports= router;
