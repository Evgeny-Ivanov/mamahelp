var express = require('express');

var app = express();

var router = express.Router();

router.get('/', function (req, res) {
    res.end('Mama Help!')
});

app.use(router);

app.listen(8080);