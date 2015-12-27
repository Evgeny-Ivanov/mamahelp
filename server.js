var express = require('express');
var path = require('path');
var compression = require('compression');
var config = require('./config/config');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var homeController = require('./controllers/home');
var authController = require('./controllers/auth');

mongoose.connect(config.get('db'));

var MamaHelpApp = function () {
    //  Scope.
    var self = this;


    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {
        var app = express();
        self.app = app;

        app.use(session({
            secret: config.get('sessionSecret'),
            resave: false,
            saveUninitialized: false
        }));

        app.use(passport.initialize());

        app.use(passport.session());
        app.use(function (req, res, next) {
            res.locals.user = req.user;
            next();
        });

        app.use(compression());

        var oneDay = 86400000;
        app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneDay}));

        app.set('views', path.join(__dirname, '/views'));
        app.set('view engine', 'jade');

        var router = express.Router();
        router.get('/', homeController.index);
        router.get('/auth/twitter', authController.twitter);
        router.get('/auth/twitter/callback', authController.twitterCallback, function (req, res) {
            res.redirect(req.session.returnTo || '/');
        });
        router.get('/auth/logout', authController.logout);
        app.use(router);
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };

    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };
};


var mamaHelp = new MamaHelpApp();
mamaHelp.initialize();
mamaHelp.start();
