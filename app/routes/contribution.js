const express = require('express');
const router = express.Router();

router.get('/contribution',function(req,res){
  res.render('contribution',{siteTitle:'contribution'});
});

module.exports= router;
