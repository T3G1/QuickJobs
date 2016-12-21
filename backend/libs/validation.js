var validator = require('validator');

exports.validateUser = function(req, res, next) {
    req.checkBody('email','Email is not valid').notEmpty().isEmail().isLength({max: 255});
    req.checkBody('password','Password is not valid').notEmpty().isLength({min:5, max: 255});
    returnErrors(req, res, next);
};

exports.validateRequest = function(req, res, next) {
    req.checkBody('title','Title is not valid').notEmpty().isLength({max: 127});
    req.checkBody('price','Price is not valid').notEmpty().isFloat();
    req.checkBody('haggle','Haggle is not valid').optional().isBoolean();
    req.checkBody('executor','Executor is not valid').notEmpty().isIn(['company', 'individual', 'both']);
    req.checkBody('startTime','Start time is not valid').notEmpty().isDate();
    req.checkBody('endTime','End time is not valid').optional().isDate();
    req.checkBody('categoryId','Category id is not valid').notEmpty().isInt();
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