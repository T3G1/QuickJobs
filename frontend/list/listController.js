'use strict';

angular.module('quickJobs.list', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/list', {
			templateUrl: 'list/listView.html',
			controller: 'listController'
		});
	}])

	.controller('listController', ['$scope', 'listService',
		function($scope, listService) {

			listService.getList().success(function(data) {
					console.log(data)
				}
			);

			$scope.proposals = [
				{
					date: '1',
					name: '222222222',
					description: '3',
					category: '4',
					cost: '5',
					region: '6'
				}, {
					date: '1',
					name: '222222222',
					description: '3',
					category: '4',
					cost: '5',
					region: '6'
				}, {
					date: '1',
					name: '222222222',
					description: '3',
					category: '4',
					cost: '5',
					region: '6'
				}, {
					date: '1',
					name: '222222222',
					description: '3',
					category: '4',
					cost: '5',
					region: '6'
				}
			]
		}]);