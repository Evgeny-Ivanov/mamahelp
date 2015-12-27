module.exports = {
    db: process.env.MONGODB || 'mongodb://admin:rhV1bQKQtieS@localhost:27017/mamahelp',

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
