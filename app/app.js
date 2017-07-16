require('dotenv').config()

const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const morgan = require('morgan');
const cookieparser= require('cookie-parser');
const nodemailer = require('nodemailer');
const express_Session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const FB = require('fb');
const flash = require('connect-flash');
// const request = require('request');

app.use(morgan('dev'));
app.use(cookieparser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express_Session({
  secret: 'dont be a developer',
  resave:true,
  saveUninitialized: true
}));

app.use(flash());

app.use(expressValidator({
  customValidators:{
    isgt:function(date){
      let d = new Date();
      return date >= d.toISOString();
    }}}));

app.use(cors());


app.set('view engine','ejs');
app.set('views','app/views');
app.set('appData',{name:'Ashwin',amount:'100'});
app.locals.donarName='Ashwin';
app.locals.amount='50';

app.use(express.static(path.join(__dirname,'public')));
app.use(require('./routes/index'));
app.use(require('./routes/donate'));
app.use(require('./routes/contact'));
app.use(require('./routes/contribution'));
app.use(require('./routes/aboutUs'));
app.use(require('./routes/thanks'));
app.use(require('./routes/login'));
app.use(require('./routes/profile'));






// app.get('/',function(req,res){
//   res.sendFile(path.join(__dirname,'public/index.html'))
// });
//
//
//
// app.post('/',function(req,res){
//
//   req.checkBody("Donation","Invalid donations").notEmpty().isAlpha();
//   req.checkBody("Donation-amount","Invalid donation amount").notEmpty().isInt().isLength({min:0,max:5});
//   req.checkBody("MiscellaneousDonation","Invalid donation amount").optional().isInt().isLength({min:0,max:5});
//   req.checkBody("firstName","Invalid firstName").notEmpty().isAlpha().isLength({min:1,max:40});
//   req.checkBody("lastName","Invalid lastName").notEmpty().isAlpha().isLength({min:1,max:40});
//   req.checkBody("addressLineOne","Invalid addressLineOne").notEmpty();
//   req.checkBody("addressLineTwo","Invalid addressLineTwo").optional();
//   req.checkBody("addressPostalCode","Invalid addressPostalCode").notEmpty();
//   req.checkBody("province","Invalid province").notEmpty();
//   req.checkBody("country","Invalid country").notEmpty().isAlpha();
//   req.checkBody("phoneNo","Invalid phoneNo").isNumeric().isLength({min:10,max:11});
//   req.checkBody("Email","Invalid Email").notEmpty().isEmail();
//   req.checkBody("confirmEmail","Invalid confirmEmail").notEmpty().isEmail().equals(req.body.Email);
//   req.checkBody("nameOnCard","Invalid nameOnCard").notEmpty().isAlpha().isLength({min:1,max:40});
//   req.checkBody("cardNumber","Invalid cardNumber").notEmpty().isLength({min:15,max:16});
//   req.checkBody("cvv","Invalid cvv").isNumeric().notEmpty().isLength({min:3,max:3});
//   req.checkBody("expiringDate","Invalid expiringDate").notEmpty().isISO8601().isgt();
//
//   var errors = req.validationErrors();
//   if(errors){
//     console.log(errors);
//   }
//
// });
//
// app.post('/submit',function(req,res){
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
//


app.listen(3000,function(){
  console.log("server is running on port : 3000");
});



module.exports= app;
