require('dotenv').config()

const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const morgan = require('morgan');
const cookieparser= require('cookie-parser');
const nodemailer = require('nodemailer');
const express_Session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const FB = require('fb');
const flash = require('connect-flash');
const credit = require('creditcards/card');
const CVV = require('creditcards/cvc');
// const request = require('request');

app.use(morgan('dev'));
app.use(cookieparser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express_Session({
  secret: process.env.SECRET,
  resave:true,
  saveUninitialized: true
}));

app.use(flash());

app.use(expressValidator({
  customValidators:{
    isgt:function(date){
      let d = new Date();
      return date >= d.toISOString();
    }}}));

app.use(cors());


app.set('view engine','ejs');
app.set('views','app/views');


app.use(express.static(path.join(__dirname,'public')));
app.use(require('./routes/index'));
app.use(require('./routes/donate'));
app.use(require('./routes/contact'));
app.use(require('./routes/contribution'));
app.use(require('./routes/aboutUs'));
app.use(require('./routes/thanks'));
app.use(require('./routes/login'));
app.use(require('./routes/profile'));
app.use(require('./routes/blog'));
app.use(require('./routes/food'));
app.use(require('./routes/forest'));
app.use(require('./routes/gallery'));
app.use(require('./routes/water'));
app.use(require('./routes/wildlife'));



app.listen(3000,function(){
  console.log("server is running on port : 3000");
});



module.exports= app;
