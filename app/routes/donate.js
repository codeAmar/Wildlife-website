require('dotenv').config();

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const EmailTemplate = require('email-templates').EmailTemplate
const wellknown = require('nodemailer-wellknown');
const path = require('path');
const credit = require('creditcards/card');
const CVV = require('creditcards/cvc');

mongoose.connect(process.env.DB_URL, function(err) {
  if (err) {
    console.log("error occurred while connecting to database");
  } else {
    console.log('connected to server');
  }
});


var donateSchema = mongoose.Schema({
  donation: String,
  donationAmount: {
    type: Number
  },
  miscellaneousDonation: {
    type: Number
  },
  firstName: String,
  lastName: String,
  addressLineOne: String,
  addressLineTwo: String,
  addressPostalCode: String,
  province: String,
  country: String,
  phoneNo: {
    type: Number
  },
  Email: String,
  nameOnCard: String,
  cardNumber: {
    type: Number
  },
  cvv: {
    type: Number
  },
  expiringDate: {
    type: Date
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

var donate = mongoose.model('donate', donateSchema);


var mailDelivered = false;


var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.USER_THANKS,
    pass: process.env.PASSWORD_THANKS
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


router.get('/donate', function(req, res) {
  res.render('donate', {
    siteTitle: 'donate',
    errors: req.flash('errors'),
    success: req.flash('success'),
    err: req.flash('err')
  });
});


router.post('/donate', function(req, res) {
  req.checkBody("Donation", "Invalid donations").notEmpty().isAlpha();
  req.checkBody("DonationAmount", "Invalid donation amount").notEmpty().isInt().isLength({
    min: 0,
    max: 5
  });
  req.checkBody("MiscellaneousDonation", "Invalid donation amount").optional().isInt().isLength({
    min: 0,
    max: 5
  });
  req.checkBody("firstName", "Invalid firstName").notEmpty().isAlpha().isLength({
    min: 1,
    max: 40
  });
  req.checkBody("lastName", "Invalid lastName").notEmpty().isAlpha().isLength({
    min: 1,
    max: 40
  });
  req.checkBody("addressLineOne", "Invalid addressLineOne").notEmpty();
  req.checkBody("addressLineTwo", "Invalid addressLineTwo").optional();
  req.checkBody("addressPostalCode", "Invalid addressPostalCode").notEmpty();
  req.checkBody("city", "Invalid City").notEmpty();
  req.checkBody("state", "Invalid province").notEmpty();
  req.checkBody("country", "Invalid country").notEmpty().isAlpha();
  req.checkBody("phoneNo", "Invalid phoneNo").isNumeric().isLength({
    min: 10,
    max: 11
  });
  req.checkBody("Email", "Invalid Email").notEmpty().isEmail();
  req.checkBody("confirmEmail", "Invalid confirmEmail").notEmpty().isEmail().equals(req.body.Email);
  req.checkBody("nameOnCard", "Invalid nameOnCard").notEmpty().isAlpha().isLength({
    min: 1,
    max: 40
  });
  // req.checkBody("cardNumber","Invalid cardNumber").notEmpty().isLength({min:15,max:16});
  // req.checkBody("cvv","Invalid cvv").isNumeric().notEmpty().isLength({min:3,max:3});
  let cardNum = credit.parse(req.body.cardNumber);
  let whichCardType = credit.type(cardNum);
  let isValidCard = credit.luhn(cardNum);
  let isValidCvv = CVV.isValid(req.body.cvv);
  req.checkBody("expiringDate", "Invalid expiringDate").notEmpty().isISO8601().isgt();

  var errors = req.validationErrors();
  console.log("errors is an array :" + typeof(errors));
  if (!isValidCard && typeof(errors) === 'object') {
    errors.push({
      msg: "Invalid Card Number"
    });
  } else if (!isValidCard && typeof(errors) === 'boolean') {
    var errors = [];
    errors.push({
      msg: "Invalid Card Number"
    });
  }
  if (!isValidCvv && typeof(errors) === 'object') {
    errors.push({
      msg: "Invalid Card cvv"
    });
  } else if (!isValidCvv && typeof(errors) === 'boolean') {
    var errors = [];
    errors.push({
      msg: "Invalid Card cvv"
    });
  }
  if (errors) {
    console.log(errors);
    req.flash('errors', errors.map((err) => err.msg));
    res.redirect('/donate');
  } else {


    ////////////////////////////////////

    var currentDonar = new donate({
      donation: req.body.Donation,
      donationAmount: req.body.DonationAmount,
      miscellaneousDonation: req.body.miscellaneousDonation,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      addressLineOne: req.body.addressLineOne,
      addressLineTwo: req.body.addressLineTwo,
      addressPostalCode: req.body.addressPostalCode,
      province: req.body.state,
      country: req.body.country,
      phoneNo: req.body.phoneNo,
      Email: req.body.Email,
      nameOnCard: req.body.nameOnCard,
      cardNumber: req.body.cardNumber,
      cvv: req.body.cvv,
      expiringDate: req.body.expiringDate,
      updated: new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    });

    donate.find({}, function(err, data) {
      console.log("finding all users inside db :" + data + "====================");
    });


    console.log('found all ');
    donate.findOne({
      Email: currentDonar.Email
    }, function(err, data) {
      if (!data) {
        currentDonar.save(function(err, data) {
          if (err) {
            console.log('error while saving the currentDonar.save')
          }
        });
      } else {
        console.log("user already exists in donars list");
      }
    });
    console.log(smtpTransport);
    deliverMail().then(function(mailDelivered) {
      res.render('thanks', {
        siteTitle: 'thanks',
        name: req.body.firstName,
        email: req.body.Email,
        delivered: mailDelivered,
        success: 'form validation completed'
      })
    }).catch(function(err) {
      req.flash('err', err);
      res.redirect('/donate');
    });

  }
});


function deliverMail() {
  return new Promise((resolve, reject) => {
    template.render(locals, function(err, results) {
      if (err) {
        return console.error("error while rendering the template " + err)
        reject(err);
        return;
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
          reject(err);
          return;
        } else {
          resolve(true);
        }
      })
    });
  })
}


//
// router.post('/submit',function(req,res){
//   console.log(req.body);
//   // g-recaptcha-response is the key that browser will generate upon form submit.
//   // if its blank or null means user has not selected the captcha, so return the error.
//   if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
//     return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
//   }
//   // Put your secret key here.
//   var secretKey = "6Lf6NiYUAAAAAEFZUWlTHO9qvSq-KmFljWA4LhIZ";
//   // req.connection.remoteAddress will provide IP address of connected user.
//   var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
//   // Hitting GET request to the URL, Google will respond with success or error scenario.
//   request(verificationUrl,function(error,response,body) {
//     body = JSON.parse(body);
//     console.log(body);
//     // Success will be true or false depending upon captcha validation.
//     if(body.success !== undefined && !body.success) {
//       return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
//     }
//     res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
//   });
// });


module.exports = router;
