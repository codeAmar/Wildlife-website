require('dotenv').config()

const express = require('express');
const router = express.Router();

router.get('/gallery',function(req,res){
  res.render('gallery',{siteTitle:'gallery'});
});

module.exports= router;
