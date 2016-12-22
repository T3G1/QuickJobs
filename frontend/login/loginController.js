'use strict';

angular.module('quickJobs.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/loginView.html',
            controller: 'loginController'
        });
    }])

    .controller('loginController', ['$scope', '$location', 'loginService', '$rootScope', '$http', function ($scope, $location, loginService) {

        $scope.user = {email: undefined, pass: undefined};
        $scope.logIn = function () {
            var data = {'email': $scope.user.email, 'password': $scope.user.pass};
            loginService.login(data).then(function() {
                window.location = '/list';

            })
        };

        $scope.signUp = function () {
            var data = {'email': $scope.user.email, 'password': $scope.user.pass};
            loginService.signup(data)
        }
    }]);