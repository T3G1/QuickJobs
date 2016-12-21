var db = require('./dbConnection');
var logger = require('./libs/logger');
var config = require('./libs/config');

var type = 'client';
exports.type = type;

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
                middlename: req.body.middlename,
                phonenum: req.body.phonenum
            };
            connection.query('INSERT INTO clients SET ?', client, function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Can not create new user'});
                } else {
                    logger.info('User was created successfully', result);
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