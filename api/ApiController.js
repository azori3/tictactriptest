const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    limit: '5mb',
    parameterLimit: 100000,
    extended: false
}));
router.use(bodyParser.json());
const User = require('./models/User');
const VerifyToken = require('./helpers/VerifyToken');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const justify = require("./helpers/justify");

const {wordCount, rateLimitCount} = require('./helpers/rateLimit');
router.post('/token', (req,res, next) => {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) {
           return next();
        }
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        return res.status(200).send({ auth: true, token: token, wordPerDay: user.wordPerDay });
    });
},(req,res) => {
    User.create({
            email: req.body.email,
            wordPerDay: 80000
        },
        (err, user) => {
            if (err) return res.status(500).send("There was a problem registering the user.");

            const token = jwt.sign({id: user._id}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            return res.status(200).send({auth: true, token: token, wordPerDay: user.wordPerDay});
        });
});


router.post('/justify',VerifyToken // check for token validity
    ,(req,res,next) => { //Reset daily rate limite every ONE_DAY
    const CurrentDate = new Date();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    let daily = req.user.daily;
    daily = new Date(daily);
    if(CurrentDate - daily > ONE_DAY){
        User.findByIdAndUpdate(req.user.id,
            { $set: { wordPerDay: config.rateLimite, daily: CurrentDate }},
            { new: true }, function (err, user) {
                if (err) return res.status(500).send('Error on the server.');;
                req.user = user;
                return next();
            });
    }else{
        next();
    }
},(req,res,next) => {
    if (req.is('text/*')) {
        req.text = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk){ req.text += chunk });
        req.on('end', next);
    } else {
        return res.status(500).send("invalid input type");
    }
},(req,res,next) => { // check if word per day != 0
        if (rateLimitCount(req.user.wordPerDay, wordCount(req.text)) <= 0) return res.status(402).send('Payment Required.');
        next();
},(req,res,next) => { // count and update the wordperday value
    User.findByIdAndUpdate(req.user.id,
        { $set: { wordPerDay: rateLimitCount(req.user.wordPerDay, wordCount(req.text)) }},
        { new: true }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');;
        req.user = user;
        next();
    });
},(req,res) => { // justify and return the text
    res.send(justify(req.text))
});


module.exports = router;