// Load required packages
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var config = require('../config/config');
var uuid = require('node-uuid');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new TwitterStrategy(config.get('twitter'), function (req, accessToken, tokenSecret, profile, done) {
    User.findOne({'twitter.id': profile.id}, function (err, existingUser) {
        if (err) return done(err);
        if (existingUser) return done(null, existingUser);

        var user = new User();

        user.twitter.id = profile.id;
        user.twitter.username = profile.username;
        user.twitter.token = user.encrypt(accessToken);
        user.name = profile.displayName;
        user.username = 'user_' + uuid.v4();

        console.log('New user created: ' + user);
        user.save(function (err) {
            done(err, user);
        });
    });
}));
passport.use(new FacebookStrategy(config.get('facebook'), function (token, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id}, function (err, existingUser) {
        if (err)  return done(err);
        if (existingUser) return done(null, existingUser);

        var user = new User();

        user.facebook.id = profile.id;
        user.facebook.token = user.encrypt(token);
        if (profile.emails) {
            user.email = profile.emails[0].value;
        }
        user.name = profile.displayName;
        user.username = 'user_' + uuid.v4();

        console.log('New user created: ' + user);
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