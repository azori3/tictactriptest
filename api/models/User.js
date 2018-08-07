const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email: String,
    wordPerDay : Number,
    daily : { type: Date, default: Date.now }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');