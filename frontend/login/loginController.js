'use strict';

angular.module('quickJobs.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/loginView.html',
            controller: 'loginController'
        });
    }])

    .controller('loginController', ['$scope', '$location', 'loginService', '$rootScope', 'preferences',
        function ($scope, $location, loginService, $rootScope, preferences) {

        $scope.user = {email: undefined, pass: undefined};
        $scope.logIn = function () {
            var data = {'email': $scope.user.email, 'password': $scope.user.pass};
            loginService.login(data).then(function(data) {
                preferences.set('user', data.data.currentUser);
                $rootScope.isLoggedIn = true;
                $location.path('/list');
            }, function(error){});
        };

        $scope.signUp = function () {
            var data = {'email': $scope.user.email, 'password': $scope.user.pass};
            loginService.signup(data)
        }
    }]);