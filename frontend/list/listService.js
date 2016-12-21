'use strict';

angular.module('quickJobs.list').factory('listService',
    ['$http', function($http) {
        return {
            saveAssignment: function(projectId, user) {
                return $http.post('api/v1/user/assignment/' + projectId, user);
            }
        }
    }
    ]);
