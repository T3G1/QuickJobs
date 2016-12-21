var validator = require('validator');

exports.validateUser = function(req, res, next) {
    req.checkBody('email','Email is not valid').notEmpty().isEmail().isLength({max: 255});
    req.checkBody('password','Password is not valid').notEmpty().isLength({min:5, max: 255});
    returnErrors(req, res, next);
};

exports.validateProposal = function(req, res, next) {
    req.checkBody('title','Title is not valid').notEmpty().isLength({max: 127});
    req.checkBody('price','Price is not valid').notEmpty().isFloat();
    req.checkBody('startTime','Start time is not valid').notEmpty().isDate();
    req.checkBody('endTime','End time is not valid').optional().isDate();
    req.checkBody('category','Category is not valid').notEmpty().isLength({max: 63});
    returnErrors(req, res, next);
};

exports.validateParamsId = function(req, res, next) {
    req.checkParams('id','Id is not valid').notEmpty().isInt();
    returnErrors(req, res, next);
};

exports.validateCandidate = function(req, res, next) {
    req.checkBody('proposalId','ProposalId is not valid').notEmpty().isInt();
    req.checkBody('responseId','ResponseId is not valid').notEmpty().isInt();
    returnErrors(req, res, next);
};

exports.validateRating = function(req, res, next) {
    req.checkBody('rating','Rating is not valid').notEmpty().isFloat({min: 0, max: 5});
    req.checkBody('proposalId','ProposalId is not valid').notEmpty().isInt();
    req.checkBody('responseId','ResponseId is not valid').notEmpty().isInt();
    returnErrors(req, res, next);
};

function returnErrors(req, res, next) {
    var errors = req.validationErrors(true);
    if(errors) {
        res.status(400).json(errors);
        return;
    }
    next();
}