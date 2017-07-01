const express = require('express');
const router = express.Router();

router.get('/aboutUs',function(req,res){
  res.render('aboutUs',{siteTitle:'about us'});
});

module.exports= router;
