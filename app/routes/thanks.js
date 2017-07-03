const express = require('express');
const router = express.Router();

router.get('/thanks',function(req,res){
  res.render('thanks',{siteTitle : 'thanks'});
});

router.post('/thanks',function(req,res){
  res.render('thanks',{
    siteTitle:'thanks',
    name: req.body.firstName,
    email: req.body.Email});
});


module.exports= router;
