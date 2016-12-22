'use strict';

angular.module('quickJobs.landing').factory('landingService',
    ['$http', function ($http) {
        var self = this;

        self.getFilters = function (companyId) {
            return $http.get('api/v1/landing/filters/' + companyId);
        };

        self.transformDate = function (viewDate) {
            if (viewDate != 0) {
                var date = viewDate.replace(/\//g, '-');
                date = date.concat(':00');
            } else {
                date = null;
            }
            return date;
        };

        return self;
    }
    ]);