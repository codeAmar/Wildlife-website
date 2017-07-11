const path = require('path');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');


mongoose.connect('mongodb://codeamar:casiowr100m@cluster0-shard-00-00-s94yg.mongodb.net:27017,cluster0-shard-00-01-s94yg.mongodb.net:27017,cluster0-shard-00-02-s94yg.mongodb.net:27017/wildlife?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',function(err){
  if(err){
    console.log("error occurred while connecting to database");
  }else{
    console.log('connected to server');
  }
});


var donateSchema = mongoose.Schema({
  donation:String,
  donationAmount: {type : Number},
  miscellaneousDonation: {type : Number},
  firstName:String,
  lastName:String,
  addressLineOne:String,
  addressLineTwo:String,
  addressPostalCode:String,
  province:String,
  country:String,
  phoneNo: {type : Number},
  Email:String,
  nameOnCard:String,
  cardNumber: {type : Number},
  cvv: {type : Number},
  expiringDate: {type:Date},
  updated: {type:Date , default:Date.now }
});

var donate = mongoose.model('donate',donateSchema);





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
//////////////////////////////////////////////////
  var currentDonar = new donate({
    donation:req.body.Donation,
    donationAmount:req.body.DonationAmount,
    miscellaneousDonation:req.body.miscellaneousDonation,
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    addressLineOne:req.body.addressLineOne,
    addressLineTwo:req.body.addressLineTwo,
    addressPostalCode:req.body.addressPostalCode,
    province:req.body.province,
    country:req.body.country,
    phoneNo:req.body.phoneNo,
    Email:req.body.Email,
    nameOnCard:req.body.nameOnCard,
    cardNumber:req.body.cardNumber,
    cvv:req.body.cvv,
    expiringDate:req.body.expiringDate,
    updated:new Date().toJSON().slice(0,10).replace(/-/g,'/')
  });

  donate.find({},function(err,data){
    console.log("finding all users inside db :" + data +"====================");
  });


  console.log('found all ');
  donate.findOne({Email:currentDonar.Email},function(err,data){
    if(!data){
      currentDonar.save(function(err,data){
        if(err){
          console.log('error while saving the currentDonar.save')
        }
      });
    }else{
      console.log("user already exists in donars list");
    }
  });





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
