const path = require('path');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate
const wellknown = require('nodemailer-wellknown')


var smtpTransport = nodemailer.createTransport({
    service: "gmail",
  host: "smtp.gmail.com",
  auth: {
      user: "creativetechlangara",
      pass: "Project2"
  }
});


var template = new EmailTemplate(path.join(__dirname, '../views/partials/template/welcome-email'),{juiceOptions:{
  preserveMediaQueries: false,
  removeStyleTags: false
}})



var locals = {
  email: 'amarjotsingh90@yahoo.com',
  name: {
    first: 'amarjOT',
    last: 'sinGH'
  }
}



router.post('/thanks',function(req,res){
  console.log(smtpTransport);
   
template.render(locals, function (err, results) {
  if (err) {
    return console.error("error while rendering the template "+err)
  }

  smtpTransport.sendMail({
    // from: 'Spicy Meatball <spicy.meatball@spaghetti.com>',
    to: locals.email,
    subject: results.subject,
    html: results.html,
    text: results.text,
    attachments:[{
      filename:'image.jpg',
      path:'app/views/partials/template/welcome-email/image.jpg',
      cid:'uniqueMailImage'
    }]
  }, function (err, responseStatus) {

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
  })
})

});


router.get('/thanks',function(req,res){
  res.render('thanks',{siteTitle : addressss });
});



module.exports= router;
