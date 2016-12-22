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
            $scope.sendProposal = function () {
                console.log ('sendProposal');
            };

            $scope.logInd = function () {

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