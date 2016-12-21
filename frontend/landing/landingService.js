'use strict';

angular.module('quickJobs.landing').factory('landingService',
    ['$http', function ($http) {
        var self = this;

        self.getFilters = function (companyId) {
            return $http.get('api/v1/landing/filters/' + companyId);
        };

        return self;
    }
    ]);