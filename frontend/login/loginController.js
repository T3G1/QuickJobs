'use strict';

angular.module('quickJobs.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/loginView.html',
            controller: 'loginController'
        });
    }])

    .controller('loginController', ['$scope', '$location', 'loginService', '$rootScope', function ($scope, $location, loginService, $rootScope) {
        $rootScope.isLoggedIn = false;

        $scope.user = loginService.getUser().success(function (data) {
            if(data){
                preferences.set('user', data);

                if(data.companyId){
                    $rootScope.companyId = data.companyId;
                    $location.path('/timesheet');
                }
                else{
                    $location.path('/company-create');
                }

                $rootScope.isLoggedIn = true;
            }
        }).error(function() {
            $rootScope.isNotLoggedIn = true;
        });

        $scope.googleLogin = function(){
            window.location ='/googlelogin';
        };

        $scope.login = function () {
            $location.path('/timesheet');
            $rootScope.isLoggedIn = true;
        };
    }]);