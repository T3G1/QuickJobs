var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var compression = require('compression');

var config = require('./backend/libs/config');
var logger = require('./backend/libs/logger');
var validation = require('./backend/libs/validation');
var errorHandler = require('./backend/libs/errorHandler');
var authentication = require('./backend/libs/authentication');
var dbConfig = require('./backend/libs/dbConfig');
var router = require('./backend/router');

var app = express();
app.set('port', config.port);

app.use(cookieParser());
app.use(compression());
app.use(express.static('frontend'));

app.use('/api', bodyParser.json());

app.use(expressValidator());

var sessionConfig = {
    secret: 'homogen cat',
    name: 'kaas',
    resave: true,
    saveUninitialized: true
};

var MySQLStore = require('connect-mysql')(session);
var options = {
    config: dbConfig
};
sessionConfig.store = new MySQLStore(options);

app.use(session(sessionConfig));

authentication.init(app);

app.use(config.prefix, router.versionRouter);

//Angular html5Mode support. Shoud be the last HTTP call
app.get('/*', function (req, res, next) {
    res.sendFile('frontend/index.html', {root: __dirname});
});

// default error handler
app.use(errorHandler);
logger.info('Error handler is initialized!');

app.listen(app.get('port'), function () {
    logger.info('QuickJobs server is up on port:' + app.get('port'));
});