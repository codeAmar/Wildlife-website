const path = require('path');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const EmailTemplate = require('email-templates').EmailTemplate
const wellknown = require('nodemailer-wellknown')

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


var mailDelivered = false;


var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "creativetechlangara",
    pass: "Project2"
  }
});


var template = new EmailTemplate(path.join(__dirname, '../views/partials/template/welcome-email'), {
  juiceOptions: {
    preserveMediaQueries: false,
    removeStyleTags: false
  }
})

var locals = {
  email: 'amarjotsingh90@yahoo.com',
  name: {
    first: 'amarjOT',
    last: 'sinGH'
  }
}



router.post('/thanks', function(req, res) {
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
deliverMail().then(function(mailDelivered){
  res.render('thanks', {
    siteTitle: 'thanks',
    name: req.body.firstName,
    email: req.body.Email,
    delivered: mailDelivered
  })
}).catch(function(error){res.render('thanks', {
    siteTitle: 'thanks',
    name: req.body.firstName,
    email: req.body.Email,
    delivered:error
  })});
});

router.get('/thanks', function(req, res) {
  res.render('thanks', {
    siteTitle: 'addressss'
  });
});




function deliverMail(){
  return new Promise((resolve,reject)=>{
    template.render(locals, function(err, results) {
      if (err) {
        return console.error("error while rendering the template " + err)
        reject(err); return;
      }

      smtpTransport.sendMail({
        to: locals.email,
        subject: results.subject,
        html: results.html,
        text: results.text,
        attachments: [{
          filename: 'image.jpg',
          path: 'app/views/partials/template/welcome-email/image.jpg',
          cid: 'uniqueMailImage'
        }]
      }, function(err, responseStatus) {
        if (err) {
          reject(err); return;
        } else {
          resolve(true);
        }
      })
    });
  })
}

module.exports = router;
