require('dotenv').config()

const express = require('express');
const router = express.Router();

router.get('/food',function(req,res){
  res.render('food',{siteTitle:'food'});
});

module.exports= router;
