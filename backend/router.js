var express = require('express');

var validation = require('./libs/validation');
var authentication = require('./libs/authentication');

var client = require('./client');

var clientRouter = express.Router();
clientRouter.put('/create-request',
    authentication.ensureAuthenticated(client.type),
    validation.validateRequest,
    client.createRequest);
clientRouter.get('/my-requests',
    authentication.ensureAuthenticated(client.type),
    client.getMyRequests);
clientRouter.get('/response/:id',
    authentication.ensureAuthenticated(client.type),
    validation.validateParamsId,
    client.getRequestResponses);
clientRouter.get('/all-requests',
    authentication.ensureAuthenticated(client.type),
    client.getAllRequests);
clientRouter.post('/send-response/:id',
    authentication.ensureAuthenticated(client.type),
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
versionRouter.use(authentication.ensureAuthenticated(), clientRouter);
versionRouter.use(userRouter);
exports.versionRouter = versionRouter;