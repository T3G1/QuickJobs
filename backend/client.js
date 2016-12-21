var db = require('./dbConnection');
var logger = require('./libs/logger');
var config = require('./libs/config');

var type = 'client';

exports.signup = function(req, res, next) {
    logger.debug('sign up API, signup email %s', req.body.email.toLowerCase());
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot create an account, please try again later'});
        } else {
            var client = {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phonenum: req.body.phonenum
            };
            connection.query('INSERT INTO clients SET ?', client, function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot create new user'});
                } else {
                    logger.info('Client was created successfully', result);
                    res.end();
                }
                connection.release();
            });
        }
    });
};

exports.changePersonalInfo = function(req, res, next) {
    logger.debug('sign up API, signup email %s', req.body.email.toLowerCase());
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot create an account, please try again later'});
        } else {
            var client = {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phonenum: req.body.phonenum
            };
            connection.query('INSERT INTO clients SET ?', client, function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot create new user'});
                } else {
                    logger.info('Client was created successfully', result);
                    res.end();
                }
                connection.release();
            });
        }
    });
};

exports.createRequest = function(req, res, next){
    logger.debug('create request API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot create a request, please try again later'});
        } else {
            var request = {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                haggle: req.body.haggle,
                executor: req.body.executor,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                clientId: req.user.id,
                categoryId: req.body.categoryId
            };
            connection.query('INSERT INTO requests SET ?', request, function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot create new request'});
                } else {
                    logger.info('Request was created successfully', result);
                    res.end();
                }
                connection.release();
            });
        }
    });
};

exports.getMyRequests = function(req, res, next){
    logger.debug('get my requests API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot get request list, please try again later'});
        } else {
            connection.query('SELECT * FROM requests WHERE clientId = ?', req.user.id, function (err, rows) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot get requests'});
                } else {
                    logger.info('Request list successfully retrieved!');
                    res.json(rows);
                }
                connection.release();
            });
        }
    });
};

exports.getRequestResponses = function(req, res, next){
    logger.debug('get requests responses API, request id %s', req.params.id);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot get response list, please try again later'});
        } else {
            connection.query('SELECT responses.clientId, clients.username as clientUsername, clients.firstname as clientFirstname, ' +
                'clients.lastname as clientLastname, clients.email as clientEmail, clients.phonenum as clientPhonenum, ' +
                'responses.companyId, companies.title as companyTitle, companies.description as companyDescription, ' +
                'companies.site as companySite, companies.email as companyEmail, companies.phonenum as companyPhonenum ' +
                'FROM responses ' +
                'LEFT JOIN clients ON responses.clientId = clients.id ' +
                'LEFT JOIN companies ON responses.companyId = companies.id ' +
                'WHERE responses.requestId = 1', req.user.id, function (err, rows) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot get requests'});
                } else {
                    logger.info('Request list successfully retrieved!');
                    res.json(rows);
                }
                connection.release();
            });
        }
    });
};

exports.getAllRequests = function(req, res, next){
    logger.debug('get all requests API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot get request list, please try again later'});
        } else {
            connection.query('SELECT * FROM requests WHERE (endTime > CURRENT_TIMESTAMP OR (endTime is NULL AND startTime > CURRENT_TIMESTAMP)) ' +
                'AND (executor = "individual" OR executor = "both")', function (err, rows) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot get requests'});
                } else {
                    logger.info('Request list successfully retrieved!');
                    res.json(rows);
                }
                connection.release();
            });
        }
    });
};

exports.sendResponse = function(req, res, next){
    logger.debug('send response API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot send response, please try again later'});
        } else {
            connection.query('INSERT INTO responses SET requestId = ?, clientId = ?', [req.params.id, req.user.id], function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot get requests'});
                } else {
                    logger.info('Response was sent successfully', result);
                    res.end();
                }
                connection.release();
            });
        }
    });
};

exports.findById = function(id, callback) {
    findClient('SELECT * from clients WHERE id = ?', [id], callback);
};

exports.findByEmail = function(email, password, callback) {
    findClient('SELECT * from clients WHERE email = ? AND password = ?', [email, password], callback);
};

function findClient(query, args, callback){
    return db.getConnection(function(err, connection){
        if(err) {
            callback(err);
        } else {
            connection.query(query, args, function (err, rows) {
                if (err) {
                    logger.warn('Cannot find user');
                }
                if (rows[0]) {
                    rows[0].type = type;
                }
                callback(err, rows[0]);
                connection.release();
            });
        }
    });
}