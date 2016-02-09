var express = require('express');
var router = express.Router();
var homeController = require('./controllers/home');
var authController = require('./controllers/auth');


var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        // Display the Login page with any flash message, if any
        res.render('index', {message: req.flash('message')});
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* GET Registration Page */
    router.get('/signup', function (req, res) {
        res.render('signup', {message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));


    router.get('/', homeController.index);
    router.get('/auth/twitter', authController.twitter);
    router.get('/auth/twitter/callback', authController.twitterCallback, function (req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    router.get('/auth/facebook', authController.facebook);
    router.get('/auth/facebook/callback', authController.facebookCallback, function (req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    router.get('/auth/google', authController.google);
    router.get('/auth/google/callback', authController.googleCallback, function (req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    router.get('/auth/logout', authController.logout);

    router.get('/:locale', function (req, res) {
        var locale = req.params.locale;
        //console.log('Updating user locale: ' + locale);
        res.cookie('i18n', locale);
        res.locals.locale = locale;
        res.redirect('/');
    });

    return router;
};