var express = require('express');

var validation = require('./libs/validation');
var authentication = require('./libs/authentication');

var client = require('./client');

var clientRouter = express.Router();
clientRouter.put('/create-proposal',
    validation.validateProposal,
    client.createProposal);
clientRouter.get('/proposal/:id',
    validation.validateParamsId,
    client.getProposal);
clientRouter.get('/all-proposals',
    client.getAllProposals);
clientRouter.post('/send-response/:id',
    validation.validateParamsId,
    client.sendResponse);

var userRouter = express.Router();
userRouter.get('/current-user',
    authentication.ensureAuthenticated(),
    authentication.getCurrentUser);
userRouter.put('/signup',
    validation.validateUser,
    client.signup);

var versionRouter = express.Router();
versionRouter.use('/client', authentication.ensureAuthenticated(), clientRouter);
versionRouter.use(userRouter);
exports.versionRouter = versionRouter;