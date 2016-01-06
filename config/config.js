var nconf = require('nconf');

nconf
    .argv()
    .env()
    .file({
        file: './config/config.json'
    });


var connection_string = 'mongodb://localhost:27017/mamahelp';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
nconf.set('db', connection_string);
nconf.set('cryptos:algorithm', 'aes256');
if (process.env.CRYPTO_KEY) {
    nconf.set('cryptos:key', process.env.CRYPTO_KEY);
}
if (process.env.SESSION_SECRET) {
    nconf.set('sessionSecret', process.env.SESSION_SECRET);
}
if (process.env.TWITTER_KEY) {
    nconf.set('twitter:consumerKey', process.env.TWITTER_KEY);
}
if (process.env.TWITTER_SECRET) {
    nconf.set('twitter:consumerSecret', process.env.TWITTER_SECRET);
}
if (process.env.TWITTER_CALLBACK) {
    nconf.set('twitter:callbackURL', process.env.TWITTER_CALLBACK);
}
if (process.env.FACEBOOK_CLIENTID) {
    nconf.set('facebook:clientID', process.env.FACEBOOK_CLIENTID);
}
if (process.env.FACEBOOK_CLIENTSECRET) {
    nconf.set('facebook:clientSecret', process.env.FACEBOOK_CLIENTSECRET);
}
if (process.env.FACEBOOK_CALLBACKURL) {
    nconf.set('facebook:callbackURL', process.env.FACEBOOK_CALLBACKURL);
}
if (process.env.GOOGLE_CLIENTID) {
    nconf.set('google:clientID', process.env.GOOGLE_CLIENTID);
}
if (process.env.GOOGLE_CLIENTSECRET) {
    nconf.set('google:clientSecret', process.env.GOOGLE_CLIENTSECRET);
}
if (process.env.GOOGLE_CALLBACKURL) {
    nconf.set('google:callbackURL', process.env.GOOGLE_CALLBACKURL);
}
nconf.set('twitter.passReqToCallback', true);

console.log(nconf.get());


module.exports = nconf;

