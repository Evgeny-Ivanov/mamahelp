var express = require('express'),
    path = require('path'),
    compression = require('compression'),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    i18n = require('i18n'),
    routes = require('./routes/index');


mongoose.connect(config.get('db'));

var systemLocales = ['en', 'ua', 'ru'];
i18n.configure({
    locales: systemLocales,
    directory: __dirname + '/locales',
    //directory: path.join(__dirname, 'locales'),
    //defaultLocale: 'en',
    cookie: 'i18n'
});



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

        app.use(cookieParser(config.get('sessionSecret')));
        app.use(session({
            secret: config.get('sessionSecret'),
            resave: false,
            saveUninitialized: false,
            cookie: {maxAge: 60000}
        }));


        app.use(i18n.init);

        var hi = i18n.__('Hello');
        console.log(hi);

        app.use(passport.initialize());

        app.use(passport.session());
        app.use(function (req, res, next) {
            res.locals.user = req.user;
            res.locals.systemLocales = systemLocales;
            var languageHeader = req.headers['accept-language'];
            if (languageHeader && !res.locals.locale) {
                //console.log('User locale set: ' + languageHeader);
                var locale = languageHeader.split(';')[0].split(',')[1];
                res.locals.locale = locale;
            }
            next();
        });

        app.use(compression());

        var oneDay = 86400000;
        app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneDay}));

        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');

        var routes = routes.route(passport);
        app.use('/', routes);
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
            console.log('%s: Node server started on %s:%d ...' +
                new Date(Date.now()), self.ipaddress, self.port);
        });
    };
};


var mamaHelp = new MamaHelpApp();
mamaHelp.initialize();
mamaHelp.start();
