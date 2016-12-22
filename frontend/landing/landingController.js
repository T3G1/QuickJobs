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
            ],
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
                landingService.createProposal(data);
            };

            $scope.logIn = function () {
                var data = {'email': $scope.user.email, 'password': $scope.user.pass};
                landingService.login(data).then(function(){
                    if ($scope.prop != 0) {
                        $scope.sendProposal();

                    }
                })
            };

            $scope.signUp = function () {
                var data = {'email': $scope.user.email, 'password': $scope.user.pass};
                landingService.signup(data).then(function(){
                    $scope.logIn()
                },
                function(err) {
                    console.log(err);
                })
            }
        }]);