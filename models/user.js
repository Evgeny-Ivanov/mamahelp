// Load required packages
var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../config/config');

// Define our user schema
var UserSchema = new mongoose.Schema({
    twitter: {
        id: String,
        token: String,
        username: String
    },
    facebook: {
        id: String,
        token: String
    },
    username: {type: String, unique: true, lowercase: true},
    password: String,
    email: {type: String, lowercase: true, default: ''},
    name: {type: String, default: ''},
    created: {type: Date, default: new Date()}
});

UserSchema.methods.encrypt = function (text) {
    var algorithm = config.get('cryptos:algorithm');
    var key = config.get('cryptos:key');

    var cipher = crypto.createCipher(algorithm, key);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
};

UserSchema.methods.decrypt = function (text) {
    var algorithm = config.get('cryptos:algorithm');
    var key = config.get('cryptos:key');

    var decipher = crypto.createDecipher(algorithm, key);
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);