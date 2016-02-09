// Load required packages
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var config = require('../config/config');
var uuid = require('node-uuid');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

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
        user.twitter.tokenSecret = user.encrypt(tokenSecret);
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
        user.facebook.refreshToken = user.encrypt(refreshToken);
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
passport.use(new GoogleStrategy(config.get('google'), function (token, refreshToken, profile, done) {
    User.findOne({'google.id': profile.id}, function (err, existingUser) {
        if (err) done(err);
        if (existingUser) return done(null, existingUser);
        var user = new User();

        user.google.id = profile.id;
        if (token) {
            user.google.token = user.encrypt(token);
        }
        if (refreshToken) {
            user.google.refreshToken = user.encrypt(refreshToken);
        }
        if (profile.emails) {
            user.email = profile.emails[0].value;
        }
        user.name = profile.displayName;
        user.username = 'user_' + uuid.v4();

        console.log('New user created: ' + user);
        user.save(function (err) {
            done(err, user);
        });
    })
}));

passport.use('signup', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {

        findOrCreateUser = function () {
            // find a user in Mongo with provided username
            User.findOne({'username': username}, function (err, user) {
                // In case of any error, return using the done method
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log('User already exists with username: ' + username);
                    return done(null, false, req.flash('message', 'User Already Exists'));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.email = req.param('email');
                    newUser.firstName = req.param('firstName');
                    newUser.lastName = req.param('lastName');

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration successful');
                        return done(null, newUser);
                    });
                }
            });
        };
        // Delay the execution of findOrCreateUser and execute the method
        // in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    })
);

passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        // check in mongo if a user with username exists or not
        User.findOne({'username': username},
            function (err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log the error and redirect back
                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false, req.flash('message', 'User Not found.'));
                }
                // User exists but wrong password, log the error
                if (!isValidPassword(user, password)) {
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }
                // User and password both match, return user from done method
                // which will be treated like success
                return done(null, user);
            }
        );

    })
);

exports.twitter = passport.authenticate('twitter');
exports.twitterCallback = passport.authenticate('twitter', {failureRedirect: '/'});
exports.facebook = passport.authenticate('facebook');
exports.facebookCallback = passport.authenticate('facebook', {failureRedirect: '/'});
exports.google = passport.authenticate('google', {scope: ['profile', 'email']});
exports.googleCallback = passport.authenticate('google', {failureRedirect: '/'});

exports.logout = function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};

exports.signup = function (req, res) {
    console.log('aaaaaaa');
    res.render('signup');
};

exports.signuppost = function (req, res) {
    var user = new User();

    if (profile.emails) {
        user.email = req
    }
    user.name = profile.displayName;
    user.username = 'user_' + uuid.v4();

    console.log('New user created: ' + user);
    user.save(function (err) {
        done(err, user);
    });

    res.render('signup_success');
};

// Generates hash using bCrypt
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
};