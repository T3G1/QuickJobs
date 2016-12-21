'use strict';

angular.module('quickJobs.landing', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/landing', {
            templateUrl: 'landing/landingView.html',
            controller: 'landingController'
        });
    }])

    .controller('landingController', ['$scope', 'landingService',
        function($scope, landingService) {
            console.log('landing');
        }]);