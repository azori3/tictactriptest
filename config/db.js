const mongoose = require('mongoose');
const config = require('../config/config');
// connect to ml db
mongoose.connect(config.dbLink).catch(e => {
    console.log(config.dbLink);
    console.log(e);
});