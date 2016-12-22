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
                startTime: new Date(req.body.startTime),
                endTime: req.body.endTime ? new Date(req.body.endTime) : null,
                clientId: req.user.id,
                category: req.body.category,
                region: req.body.region,
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
    logger.debug('get all proposals API');
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot get proposal list, please try again later'});
        } else {
            connection.query('SELECT clients.email, proposals.id, proposals.title, proposals.description, proposals.price, ' +
                'proposals.startTime, proposals.endTime, proposals.category, proposals.region, proposals.inProgress FROM proposals, clients ' +
                'WHERE proposals.clientId = clients.id ORDER BY id DESC', function (err, rows) {
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
    logger.debug('get proposal API, proposal id %s', req.params.id);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot get proposal, please try again later'});
        } else {
            connection.query('SELECT clientId FROM proposals WHERE id = ? UNION SELECT clientId FROM responses WHERE proposalId = ? AND chosen = 1', [req.params.id, req.params.id], function (err, clients) {
                if (err) {
                    logger.error(err);
                    connection.release();
                    next({message: 'Cannot get proposal'});
                } else {
                    var hiddenText = '';
                    if (!req.user){
                        req.user = {id: 0};
                    }
                    if (clients.find(function(client){return client.clientId == req.user.id})){
                        hiddenText = ', proposals.hiddenText';
                    }
                    connection.query('SELECT id, title, description, price, startTime, endTime, category, region, clientId, inProgress' + hiddenText + ' FROM proposals WHERE id = ?',
                        req.params.id, function (err, proposal) {
                        if (err) {
                            logger.error(err);
                            connection.release();
                            next({message: 'Cannot get proposal'});
                        } else {
                            connection.query('SELECT responses.id, responses.proposalId, responses.chosen, responses.time, clients.email, responses.rating, average.rating as averageRating  ' +
                            'FROM responses, (SELECT clientId, ROUND(AVG(rating),2)  as rating FROM responses GROUP BY clientId) as average, clients ' +
                            'WHERE proposalId = ? AND average.clientId = responses.clientId AND clients.id = responses.clientId', req.params.id, function (err, responses) {
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

exports.chooseCandidate = function(req, res, next){
    logger.debug('choose candidate API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot choose candidate, please try again later'});
        } else {
            checkOwnership(connection, req, res, next, function(connection, req, res, next){
                connection.query('SELECT chosen FROM responses WHERE proposalId = ?', req.body.proposalId, function (err, chosen) {
                    if (err) {
                        logger.error(err);
                        connection.release();
                        next({message: 'Cannot choose candidate'});
                    } else {
                        if (!chosen.find(function (elem) { return elem.chosen == 1;})) {
                            connection.query('UPDATE responses SET chosen = 1 WHERE id = ?', req.body.responseId, function (err, result) {
                                if (err) {
                                    logger.error(err);
                                    next({message: 'Cannot choose candidate'});
                                } else {
                                    logger.info('Candidate was chosen successfully', result);
                                    res.end();
                                }
                                connection.release();
                            });
                        } else {
                            res.status(400).json({error: 'There already is a chosen candidate for this proposal'});
                            connection.release();
                        }
                    }
                });
            });
        }
    });
};

exports.revertCandidateChoice = function(req, res, next){
    logger.debug('revert candidate choice API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot revert candidate choice, please try again later'});
        } else {
            checkOwnership(connection, req, res, next, function(connection, req, res, next) {
                connection.query('UPDATE responses SET chosen = 0 WHERE id = ?', req.body.responseId, function (err, result) {
                    if (err) {
                        logger.error(err);
                        next({message: 'Cannot revert candidate choice'});
                    } else {
                        logger.info('Candidate choice was reverted successfully', result);
                        res.end();
                    }
                    connection.release();
                });
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
            connection.query('SELECT * FROM responses WHERE proposalId = ?', req.params.id, function (err, responses) {
                if (err) {
                    logger.error(err);
                    connection.release();
                    next({message: 'Cannot create new proposal'});
                } else {
                    if (!responses.find(function(response){ return response.clientId == req.user.id})){
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
                    } else{
                        res.status(400).json({error: 'There already is a response for this proposal'});
                        connection.release();
                    }
                }
            });
        }
    });
};

exports.closeAndRate = function(req, res, next){
    logger.debug('close&rate API, user email %s', req.user.email);
    db.getConnection(function(err, connection){
        if(err) {
            logger.error(err);
            next({message: 'Cannot close proposal, please try again later'});
        } else {
            checkOwnership(connection, req, res, next, function(connection, req, res, next){
                connection.query('UPDATE responses, proposals ' +
                    'SET proposals.inProgress = 0, responses.rating = ? ' +
                    'WHERE proposals.id = ? AND responses.id = ? AND responses.proposalId = proposals.id',
                    [req.body.rating, req.body.proposalId, req.body.responseId], function (err, result) {
                        if (err) {
                            logger.error(err);
                            next({message: 'Cannot close proposal'});
                        } else {
                            logger.info('Response was sent successfully', result);
                            res.end();
                        }
                        connection.release();
                    });
            });
        }
    });
};

function checkOwnership(connection, req, res, next, callback){
    connection.query('SELECT clientId FROM proposals WHERE id = ?', req.body.proposalId, function (err, owner) {
        if (err) {
            logger.error(err);
            connection.release();
            next({message: 'Cannot choose candidate'});
        } else {
            if (owner[0].clientId == req.user.id) {
                callback(connection, req, res, next);
            } else {
                res.status(400).json({error: 'You don\'t own this proposal'});
                connection.release();
            }
        }
    });
}

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