const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require('path');

router.get('/contact',function(req,res){
  res.render('contact',{siteTitle:'contact'});
});


var SmtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "creativetechlangaraemail",
        pass: "Project2"
    }
});


router.get('/contact/send',function(req,res){

    var mailOptions={
        to : req.query.email,
        bcc:'creativetechlangara@gmail.com',
        subject : 'contact form submission',
        html:req.query.message,
    }
    // router.post('/contact/send',function(req,res){
    //
    //     var mailOptions={
    //         to : req.body.email,
    //         subject : 'contact form submission',
    //         html:req.body.message,
    //     }
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
});

module.exports= router;
