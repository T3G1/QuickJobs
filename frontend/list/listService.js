'use strict';

angular.module('quickJobs.list').factory('listService',
    ['$http', function($http) {
        return {
            getList: function() {
                return $http.get('/api/client/all-proposals');
            }
        }
    }
    ]);
