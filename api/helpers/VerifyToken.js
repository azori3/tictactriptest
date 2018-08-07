const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const User = require('../models/User');

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token)
    // if no token provided
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // if everything good, save to request for use in justify route
        User.findById(decoded.id, (err, user) => {
            if (err) return res.status(500).send('Error on the server.');
            if (!user) return res.status(404).send('No user found.');
            req.user = user;
            next();
        });
    });
}
module.exports = verifyToken;