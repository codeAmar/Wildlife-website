const bodyparser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cors());

app.listen(3000,function(){
  console.log("server running on port : 3000");
})

// app.use(express.static('public/form.html'))
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'public','form.html'))
})

module.exports= app;
