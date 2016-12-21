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
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/landing'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }])

    .run(['$rootScope', function($rootScope){
        $rootScope.categories = [
            { name: 'Tutors', group: 'Educational'},
            { name: 'House maintenance', group: 'Household'},
            { name: 'Cleaning', group: 'Household'},
            { name: 'Walking pets', group: 'Household'},
            { name: 'Babysitting', group: 'Household'},
            { name: 'Auto rental', group: 'Carriage'},
            { name: 'Mover', group: 'Carriage'},
            { name: 'Designated driver', group: 'Carriage'},
            { name: 'Accountance/Bookkeeping', group: 'Business'},
            { name: 'Legal advice', group: 'Business'},
            { name: 'Car wash', group: 'Cars'},
            { name: 'Utilities', group: 'Cars'},
            { name: 'Body repair', group: 'Cars'},
            { name: 'Custom vehicles repair', group: 'Cars'}
        ];
    }])


    .controller('quickJobsController', ['$scope', '$location',
        function($scope, $location) {
            $scope.changeView = function(view){
                $location.path(view);
            }
        }]);