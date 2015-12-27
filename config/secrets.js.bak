var connection_string = 'mongodb://localhost:27017/mamahelp';
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

module.exports = {
    db: connection_string,

    cryptos: {
        algorithm: 'aes256',
        key: process.env.CRYPTO_KEY || 'Your crypto key goes here'
    },

    sessionSecret: process.env.SESSION_SECRET || 'Your session secret goes here',

    twitter: {
        consumerKey: process.env.TWITTER_KEY || 'kHK36uE9mkLoh6XgJfPTLEMPX',
        consumerSecret: process.env.TWITTER_SECRET || 'QtFZZmJ60YCA2OknX63FCnZcce9UrXCiLn7CrcuSmgXe2pZLJ4',
        callbackURL: process.env.TWITTER_CALLBACK || 'http://localhost:8080/auth/twitter/callback',
        passReqToCallback: true
    }
};
