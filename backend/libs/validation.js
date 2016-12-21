var validator = require('validator');

exports.validateUser = function(req, res, next) {
    req.checkBody('email','Email is not valid').notEmpty().isEmail().isLength({max: 255});
    req.checkBody('password','Password is not valid').notEmpty().isLength({min:5, max: 255});
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