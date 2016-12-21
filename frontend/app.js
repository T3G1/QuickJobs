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
            {
                name: 'Educational',
                subcategories: ['Tutors']
            },
            {
                name: 'Household',
                subcategories: ['House maintenance', 'Cleaning', 'Walking pets', 'Babysitting']
            },
            {
                name: 'Carriage',
                subcategories: ['Auto rental', 'Mover', 'Designated driver']
            },
            {
                name: 'Business',
                subcategories: ['Accountance/Bookkeeping', 'Legal advice']
            },
            {
                name: 'Cars',
                subcategories: ['Car wash', 'Utilities', 'Body repair', 'Custom vehicles repair']
            }
        ];
    }])


    .controller('quickJobsController', ['$scope', '$location',
        function($scope, $location) {
            $scope.changeView = function(view){
                $location.path(view);
            }
        }]);