const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;



mongoose.connect('mongodb://codeamar:casiowr100m@cluster0-shard-00-00-s94yg.mongodb.net:27017,cluster0-shard-00-01-s94yg.mongodb.net:27017,cluster0-shard-00-02-s94yg.mongodb.net:27017/wildlife?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',function(err){
  if(err){
    console.log("error occurred while connecting to database");
  }else{
    console.log('connected to server');
  }
});

var userSchema = mongoose.Schema({
  id: String,
  email : String,
  name: String
});

var user = mongoose.model('user',userSchema);

passport.use(new Strategy({
  clientID: '228016534379104',
  clientSecret: 'f17eb61bdcca911ece7b5dbf862faefe',
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id', 'displayName', 'photos', 'email','location','hometown']
    },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    var currentUser = new user({
      email:profile.emails[0].value,
      name:profile.displayName,
      id:profile.id

    });

    user.find({},function(err,data){
      console.log("finding all users inside db :" + data +"====================");
    });


console.log('found all ');
    user.findOne({email:currentUser.email},function(err,data){
      if(!data){
        currentUser.save(function(err,data){
          if(err){
            return cb(err);
          }
          cb(null,currentUser);
        });
      }else{
        cb(null,data);
      }
    });
}));


passport.serializeUser(function(user, cb) {
  console.log('inside serializeUser :' + user );
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  user.findById(obj,function(err,user){
    cb(err, user);
  });
});



router.use(passport.initialize());
router.use(passport.session());


router.get('/login',function(req,res){
  res.render('login',{siteTitle:'login',user: req.user });
});

router.get('/login/facebook',
              passport.authenticate('facebook'));

router.get('/login/facebook/return',
              passport.authenticate('facebook',{failureRedirect:'/login'}),
              function(req,res){
                res.redirect('/login');
              });

module.exports= router;
