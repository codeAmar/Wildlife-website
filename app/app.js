const bodyparser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const path = require('path');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(expressValidator({
  customValidators:{
    isgt:function(date){
      let d = new Date();
      return date >= d.toISOString(); 
    }}}));

app.use(cors());


app.listen(3000,function(){
  console.log("server is running on port : 3000");
});

app.use(express.static(path.join(__dirname,'public')));
app.post('/',function(req,res){

  req.checkBody("Donation","Invalid donations").notEmpty().isAlpha();
  req.checkBody("Donation-amount","Invalid donation amount").notEmpty().isInt().isLength({min:0,max:5});
  req.checkBody("MiscellaneousDonation","Invalid donation amount").optional().isInt().isLength({min:0,max:5});
  req.checkBody("firstName","Invalid firstName").notEmpty().isAlpha().isLength({min:1,max:40});
  req.checkBody("lastName","Invalid lastName").notEmpty().isAlpha().isLength({min:1,max:40});
  req.checkBody("addressLineOne","Invalid addressLineOne").notEmpty();
  req.checkBody("addressLineTwo","Invalid addressLineTwo").optional();
  req.checkBody("addressPostalCode","Invalid addressPostalCode").notEmpty();
  req.checkBody("province","Invalid province").notEmpty();
  req.checkBody("country","Invalid country").notEmpty().isAlpha();
  req.checkBody("phoneNo","Invalid phoneNo").isNumeric().isLength({min:10,max:11});
  req.checkBody("Email","Invalid Email").notEmpty().isEmail();
  req.checkBody("confirmEmail","Invalid confirmEmail").notEmpty().isEmail().equals(req.body.Email);
  req.checkBody("nameOnCard","Invalid nameOnCard").notEmpty().isAlpha().isLength({min:1,max:40});
  req.checkBody("cardNumber","Invalid cardNumber").notEmpty().isLength({min:15,max:16});
  req.checkBody("cvv","Invalid cvv").isNumeric().notEmpty().isLength({min:3,max:3});
  req.checkBody("expiringDate","Invalid expiringDate").notEmpty().isISO8601().isgt();

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
