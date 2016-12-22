'use strict';

angular.module('quickJobs.proposal').factory('proposalService',
    ['$http', function ($http) {
        var self = this;

        self.getProposal = function (proposalId) {
            return $http.get('api/client/proposal/' + proposalId);
        };

        self.response = function (proposalId) {
            return $http.post('api/client/send-response/' + proposalId);
        };

        self.chooseCandidate = function (proposalId, responseId) {
            return $http.post('api/client/choose-candidate/', {
                proposalId: proposalId,
                responseId: responseId
            });
        };

        self.closeAndRate = function (proposalId, responseId, rating) {
            return $http.post('api/client/choose-candidate/', {
                proposalId: proposalId,
                responseId: responseId,
                rating: rating
            });
        };

        return self;
    }
    ]);