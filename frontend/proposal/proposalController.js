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
            $scope.proposal = {
                date: '1',
                name: '222222222',
                description: '3',
                category: '4',
                cost: '5',
                region: '6'
            };

            $scope.responses = [{
                name: 'bla',
                rating: 3,
                date: '12.12.12'
            },{
                name: 'bla',
                rating: 3,
                date: '12.12.12'
            },{
                name: 'bla',
                rating: 3,
                date: '12.12.12'
            },{
                name: 'bla',
                rating: 3,
                date: '12.12.12'
            }];

            $("#input-id").rating();
        }]);