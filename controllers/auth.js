// Load required packages
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var config = require('../config/config');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

console.log('Creating Twitter strategy with: ' + config.get('twitter'));
passport.use(new TwitterStrategy(config.get('twitter'), function (req, accessToken, tokenSecret, profile, done) {
    User.findOne({twitterId: profile.id}, function (err, existingUser) {
        if (existingUser) return done(null, existingUser);

        var user = new User();

        user.twitterId = profile.id;
        user.username = profile.id;
        user.email = '';
        user.name = profile.displayName;
        user.created = new Date();
        user.accessToken = user.encrypt(accessToken);
        user.tokenSecret = user.encrypt(tokenSecret);

        user.save(function (err) {
            done(err, user);
        });
    });
}));
passport.use(new FacebookStrategy(config.get('facebook'), function (token, refreshToken, profile, done) {
    console.log('Looking for user with FB ID: ' + profile.id);
    User.findOne({facebookId: profile.id}, function (err, existingUser) {
        if (existingUser) return done(null, existingUser);
        console.log('FB user not found. Creating new one for profile: ' + profile);
        var user = new User();

        user.facebookId = profile.id;
        user.username = profile.id;
        user.email = '';
        user.name = profile.displayName;
        user.created = new Date();

        user.save(function (err) {
            done(err, user);
        });
    });

}));

exports.twitter = passport.authenticate('twitter');
exports.twitterCallback = passport.authenticate('twitter', {failureRedirect: '/'});
exports.facebook = passport.authenticate('facebook');
exports.facebookCallback = passport.authenticate('facebook', {failureRedirect: '/'});

exports.logout = function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};