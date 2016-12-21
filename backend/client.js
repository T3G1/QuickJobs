var db = require('./dbConnection');
var logger = require('./libs/logger');
var config = require('./libs/config');

exports.signup = function(req, res, next) {
    logger.debug('sign up API, signup email %s', req.body.email.toLowerCase());
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot create an account, please try again later'});
        } else {
            var client = {
                email: req.body.email.toLowerCase(),
                password: req.body.password
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

exports.createProposal = function(req, res, next){
    logger.debug('create proposal API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot create a proposal, please try again later'});
        } else {
            var proposal = {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                clientId: req.user.id,
                categoryId: req.body.categoryId,
                hiddenText: req.body.hiddenText
            };
            connection.query('INSERT INTO proposals SET ?', proposal, function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot create new proposal'});
                } else {
                    logger.info('Proposal was created successfully', result);
                    res.end();
                }
                connection.release();
            });
        }
    });
};

exports.getAllProposals = function(req, res, next){
    logger.debug('get all proposals API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot get proposal list, please try again later'});
        } else {
            connection.query('SELECT clients.email, proposals.id, proposals.title, proposals.description, proposals.price, ' +
                'proposals.startTime, proposals.endTime, proposals.categoryId, proposals.inProgress FROM proposals, clients ' +
                'WHERE proposals.clientId = clients.id', function (err, rows) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot get proposals'});
                } else {
                    logger.info('proposal list successfully retrieved!');
                    res.json(rows);
                }
                connection.release();
            });
        }
    });
};

exports.getProposal = function(req, res, next){
    logger.debug('get proposals API, proposal id %s', req.params.id);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot get proposal, please try again later'});
        } else {
            connection.query('SELECT clientId FROM responses WHERE proposalId = ? AND chosen = 1', req.params.id, function (err, clients) {
                if (err) {
                    logger.error(err);
                    connection.release();
                    next({message: 'Cannot get proposal'});
                } else {
                    var hiddenText = '';
                    if (clients.find(function(client){return client.clientId == req.user.id})){
                        hiddenText = ', proposals.hiddenText';
                    }
                    connection.query('SELECT id, description, price, startTime, endTime, categoryid, clientId, inProgress' + hiddenText + ' FROM proposals WHERE id = ?',
                        req.params.id, function (err, proposal) {
                        if (err) {
                            logger.error(err);
                            connection.release();
                            next({message: 'Cannot get proposal'});
                        } else {
                            connection.query('SELECT * FROM responses WHERE proposalId = ?', req.params.id, function (err, responses) {
                                if (err) {
                                    logger.error(err);
                                    next({message: 'Cannot get proposal'});
                                } else {
                                    var result = {
                                        proposal: proposal[0],
                                        responses: responses
                                    };
                                    logger.info('Proposal successfully retrieved!');
                                    res.json(result);
                                }
                                connection.release();
                            });
                        }
                    });
                }
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
            connection.query('INSERT INTO responses SET proposalId = ?, clientId = ?', [req.params.id, req.user.id], function (err, result) {
                if (err) {
                    logger.error(err);
                    next({message: 'Cannot get proposals'});
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
                callback(err, rows[0]);
                connection.release();
            });
        }
    });
}