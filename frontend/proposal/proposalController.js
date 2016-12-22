'use strict';

angular.module('quickJobs.proposal', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/proposal', {
            templateUrl: 'proposal/proposalView.html',
            controller: 'proposalController'
        });
        $routeProvider.when('/proposal/:id', {
            templateUrl: 'proposal/proposalView.html',
            controller: 'proposalController'
        });
    }])

    .controller('proposalController', ['$scope', 'proposalService', '$routeParams',
        function ($scope, proposalService, $routeParams) {
            var proposalId = $routeParams.id;

            function updateData() {
                proposalService.getProposal(proposalId).success(function (data) {
                    $scope.proposal = data.proposal;
                    $scope.responses = data.responses;
                });
            }

            updateData();

            $scope.response = function () {
                proposalService.response(proposalId).success(function () {
                    updateData();
                });
            };

            $scope.chooseCandidate = function (responseId) {
                proposalService.chooseCandidate(proposalId, responseId).success(function () {
                    updateData();
                });
            };

            $scope.closeAndRate = function () {
                var responseId = _.find($scope.responses, {chosen: 1}).id;

                proposalService.closeAndRate(proposalId, responseId, $("#input-id").val()).success(function () {
                    updateData();
                });
            };

            $("#input-id").rating();
        }]);