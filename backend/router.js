var express = require('express');

var validation = require('./libs/validation');
var authentication = require('./libs/authentication');

var client = require('./client');
var company = require('./company');

var clientRouter = express.Router();
clientRouter.put('/signup',
    validation.validateUser,
    client.signup);

var userRouter = express.Router();
userRouter.get('/current-user',
    authentication.ensureAuthenticated(),
    authentication.getCurrentUser);

var versionRouter = express.Router();
versionRouter.use('/client', clientRouter);
versionRouter.use(userRouter);
exports.versionRouter = versionRouter;