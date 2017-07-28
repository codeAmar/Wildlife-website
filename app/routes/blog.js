require('dotenv').config()

const express = require('express');
const router = express.Router();

router.get('/blog',function(req,res){
  res.render('blog',{siteTitle:'blog'});
});

module.exports= router;
