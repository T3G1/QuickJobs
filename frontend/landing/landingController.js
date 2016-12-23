'use strict';

angular.module('quickJobs.landing', ['ngRoute', 'ADM-dateTimePicker'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/landing', {
            templateUrl: 'landing/landingView.html',
            controller: 'landingController'
        });
    }])

    .controller('landingController', ['$scope', 'landingService', '$http', '$rootScope', 'preferences', 'Notification',
        function($scope, landingService, $http, $rootScope, preferences, Notification) {
            console.log('landing');
            $scope.user = {email: undefined, pass: undefined};
            $scope.prop = {};
            $scope.categories = $rootScope.categories;
            $scope.transformDate = function (viewDate) {
                if (viewDate != 0) {
                    var date = viewDate.replace(/\//g, "-").replace(' ', 'T').concat(':00Z');
                } else {
                    date = null;
                }
                return date;
            };
            $scope.sendProposal = function () {
                var data = {
                    "title": $scope.prop.name,
                    "description": $scope.prop.description,
                    "price": $scope.prop.price,
                    "startTime": $scope.transformDate($scope.prop.startDate),
                    "category": $scope.prop.category.name,
                    "region": $scope.prop.region,
                    "hiddenText": $scope.prop.comment
                };
                if($scope.transformDate($scope.prop.endDate)) {
                    data.endTime = $scope.transformDate($scope.prop.endDate);
                }
                console.log(data);
                landingService.createProposal(data).then(function() {
                    Notification({message: 'Successfully created'}, 'warning');
                });
            };

            $scope.logIn = function (user) {
                var data = user || {'email': $scope.user.email, 'password': $scope.user.pass};
                landingService.login(data).then(function(data){
                    if ($scope.prop != 0) {
                        $scope.sendProposal();
                        preferences.set('user', data.data.currentUser);
                        $rootScope.isLoggedIn = true;
                    }
                }, function () {})
            };

            $scope.signUp = function () {
                var data = {'email': $scope.user.email, 'password': $scope.user.pass};
                landingService.signup(data).then(function(){
                    $scope.logIn(data);
                },
                function(err) {
                    console.log(err);
                })
            }
        }]);