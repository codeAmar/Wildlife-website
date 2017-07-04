const express = require('express');
const router = express.Router();

router.get('/profile',
              require('connect-ensure-login').ensureLoggedIn(),
              function(req,res){
                res.render('profile',{siteTitle:'Profile',user : req.user});
});

module.exports= router;
