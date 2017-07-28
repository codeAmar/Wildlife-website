require('dotenv').config()

const express = require('express');
const router = express.Router();

router.get('/forest',function(req,res){
  res.render('forest',{siteTitle:'forest'});
});

module.exports= router;
