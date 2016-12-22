var express = require('express');

var validation = require('./libs/validation');
var authentication = require('./libs/authentication');

var client = require('./client');

var clientRouter = express.Router();
clientRouter.put('/create-proposal',
    authentication.ensureAuthenticated(),
    validation.validateProposal,
    client.createProposal);
clientRouter.get('/proposal/:id',
    validation.validateParamsId,
    client.getProposal);
clientRouter.get('/all-proposals',
    client.getAllProposals);
clientRouter.post('/send-response/:id',
    authentication.ensureAuthenticated(),
    validation.validateParamsId,
    client.sendResponse);
clientRouter.post('/choose-candidate',
    authentication.ensureAuthenticated(),
    validation.validateCandidate,
    client.chooseCandidate);
clientRouter.post('/revert-candidate-choice',
    authentication.ensureAuthenticated(),
    validation.validateCandidate,
    client.revertCandidateChoice);
clientRouter.post('/close-and-rate',
    authentication.ensureAuthenticated(),
    validation.validateRating,
    client.closeAndRate);

var userRouter = express.Router();
userRouter.get('/current-user',
    authentication.ensureAuthenticated(),
    authentication.getCurrentUser);
userRouter.put('/signup',
    validation.validateUser,
    client.signup);

var versionRouter = express.Router();
versionRouter.use('/client', clientRouter);
versionRouter.use(userRouter);
exports.versionRouter = versionRouter;