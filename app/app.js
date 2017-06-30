const bodyparser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const path = require('path');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cors());
app.use(expressValidator());


app.listen(3000,function(){
  console.log("server is running on port : 3000");
});

app.use(express.static(path.join(__dirname,'public')));
app.post('/',function(req,res){

  req.checkBody("Donation","Invalid donations").isAlpha();
  req.checkBody("Donation-amount","Invalid donation amount").isInt().isLength({min:0,max:5});
  req.checkBody("MiscellaneousDonation","Invalid donation amount").optional().isInt().isLength({min:0,max:5});
  req.checkBody("firstName","Invalid firstName").isAlpha().isLength({min:1,max:40});
  req.checkBody("lastName","Invalid lastName").isAlpha().isLength({min:1,max:40});
  req.checkBody("addressLineOne","Invalid addressLineOne").isAlphanumeric();
  req.checkBody("addressLineTwo","Invalid addressLineTwo").isAlphanumeric();
  req.checkBody("addressPostalCode","Invalid addressPostalCode").isAlphanumeric();
  req.checkBody("province","Invalid province").isAlpha();
  req.checkBody("country","Invalid country").isAlpha();
  req.checkBody("phoneNo","Invalid phoneNo").isNumeric().isMobilePhone(['en-ca','en-us','en-IN']);
  req.checkBody("Email","Invalid Email").isEmail();
  req.checkBody("confirmEmail","Invalid confirmEmail").isEmail().equals(req.body.Email);
  req.checkBody("nameOnCard","Invalid nameOnCard").isAlpha().isLength({min:1,max:40});
  req.checkBody("cardNumber","Invalid cardNumber").isNumeric().isCreditCard();
  req.checkBody("cvv","Invalid cvv").isNumeric().isLength({min:3,max:3});
  req.checkBody("expiringDate","Invalid expiringDate").isISO8601();

var errors = req.validationErrors();
if(errors){
  console.log(errors);
}

  console.log(req.body);
});
// app.get('/',function(req,res){
//   res.sendFile(path.join(__dirname,'public','form.html'))
// })

module.exports= app;
