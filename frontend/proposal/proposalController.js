'use strict';

angular.module('quickJobs.proposal', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/proposal', {
            templateUrl: 'proposal/proposalView.html',
            controller: 'proposalController'
        });
    }])

    .controller('proposalController', ['$scope', 'proposalService',
        function($scope, proposalService) {
            console.log('proposal')
        }]);