const express = require('express');
const app = express();
const db = require('./config/db');

// app.js
const ApiController = require('./api/ApiController');
app.use('/api/', ApiController);
app.get('/',(req,res)=>{
   res.send('Welcome to Justify API:\n\r /api/token => POST - x-www-form-urlencoded : {email: "your Email"} \n\r /api/justify header {x-access-token: "your token"} POST : Body/plain text');
});
module.exports = app;