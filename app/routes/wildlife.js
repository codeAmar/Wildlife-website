require('dotenv').config()

const express = require('express');
const router = express.Router();

router.get('/wildlife',function(req,res){
  res.render('wildlife',{siteTitle:'wildlife'});
});

module.exports= router;
