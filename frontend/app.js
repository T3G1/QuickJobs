'use strict';

angular.module('quickJobs', [
    'ngRoute',
    'ui.bootstrap',
    // 'preferences',
    // 'angularMoment',
    'angular-click-outside',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.select',
    'ngSanitize',
    'ngBootstrap',
    'ui-notification',
    'angular-intro',
    'angular.filter',

    'quickJobs.landing',
    'quickJobs.list',
    'quickJobs.login',
    'quickJobs.proposal'
])
    .config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
        $routeProvider.otherwise({redirectTo: '/login'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }])


    .controller('quickJobsController', ['$scope', '$location',
        function($scope, $location) {
            $scope.changeView = function(view){
                $location.path(view);
            }
        }]);