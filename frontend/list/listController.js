'use strict';

angular.module('quickJobs.list', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/listView.html',
            controller: 'listController'
        });
    }])

    .controller('listController', ['$scope', 'listService',
        function($scope, listService) {
            $scope.proposals = [{name: 'haha'}]
        }]);