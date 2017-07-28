require('dotenv').config()

const express = require('express');
const router = express.Router();

router.get('/water',function(req,res){
  res.render('water',{siteTitle:'water'});
});

module.exports= router;
