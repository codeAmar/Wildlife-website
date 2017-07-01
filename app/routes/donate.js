const express = require('express');
const router = express.Router();

router.get('/donate',function(req,res){
  res.render('donate',{siteTitle:'donate'});
});

module.exports= router;
