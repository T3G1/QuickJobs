'use strict';

angular.module('quickJobs.landing', ['ngRoute', 'ADM-dateTimePicker'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/landing', {
            templateUrl: 'landing/landingView.html',
            controller: 'landingController'
        });
    }])

    .controller('landingController', ['$scope', 'landingService', '$http',
        function($scope, landingService, $http) {
            console.log('landing');
            $scope.user = {email: undefined, pass: undefined};
            $scope.prop = {};
            $scope.categories = [
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

            $scope.sendProposal = function () {
                var data = {
                    "title": $scope.prop.name,
                    "description": $scope.prop.description,
                    "price": $scope.prop.price,
                    "startTime": landingService.transformDate($scope.prop.startDate),
                    "endTime": landingService.transformDate($scope.prop.endDate),
                    "category": $scope.prop.category.name,
                    "region": $scope.prop.region,
                    "hiddenText": $scope.prop.comment
                };
                console.log(data);
            };

            $scope.logInd = function () {
                var data = {'email': $scope.user.email, 'password': $scope.user.pass};
                var req = {
                    method: 'POST',
                    url: '/api/client/login',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                }
                $http(req).then(function() {
                    console.log('+');
                }, function(err) {
                    console.log ('err');
                    console.log (err);
                });
            };

            $scope.signUp = function () {
                var data = {'email': $scope.user.email, 'password': $scope.user.pass};
                var req = {
                    method: 'PUT',
                    url: '/api/client/signup',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                }
                $http(req).then(function() {
                    console.log('+');
                }, function(err) {
                    console.log ('err');
                    console.log (err);
                });
            }
        }]);