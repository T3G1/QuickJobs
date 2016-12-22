'use strict';

angular.module('quickJobs.landing')

.factory('landingService',
    ['$http', function($http) {
        return {
            signup: function(user) {
                return $http.put('/api/signup', user);
            },

            login: function(user) {
                return $http.post('/api/login', user);
            },
            createProposal: function(proposal) {
                return $http.put('/api/client/create-proposal', proposal)
            }
        };
    }
    ]);