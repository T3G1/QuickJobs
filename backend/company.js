var db = require('./dbConnection');
var logger = require('./libs/logger');
var config = require('./libs/config');

var type = 'company';
exports.type = type;

exports.signup = function(req, res, next) {
    logger.debug('sign up API, signup email %s', req.body.email.toLowerCase());
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot create an account, please try again later'});
        } else {
            var company = {
                title: req.body.title,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                description: req.body.description,
                site: req.body.site,
                phonenum: req.body.phonenum
            };
            connection.query('INSERT INTO companies SET ?', company, function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Can not create new company'});
                } else {
                    logger.info('Company was created successfully', result);
                    res.end();
                }
                connection.release();
            });
        }
    });
};

exports.findById = function(id, callback) {
    findCompany('SELECT * from companies WHERE id = ?', [id], callback);
};

exports.findByEmail = function(email, password, callback) {
    findCompany('SELECT * from companies WHERE email = ? AND password = ?', [email, password], callback);
};

function findCompany(query, args, callback){
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