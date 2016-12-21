
'use strict';

angular.module('quickJobs.proposal').factory('proposalService',
    ['$http', function ($http) {
        var self = this;

        self.getFilters = function (companyId) {
            return $http.get('api/v1/proposal/filters/' + companyId);
        };

        return self;
    }
    ]);