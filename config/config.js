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

console.log(nconf.get());


module.exports = nconf;

