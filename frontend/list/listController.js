'use strict';

angular.module('quickJobs.list', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/list', {
			templateUrl: 'list/listView.html',
			controller: 'listController'
		});
	}])
	.filter('price', function() {
		return function(items, minPrice, maxPrice) {
			var out = [];

			console.log('items');
			console.log(items);

			angular.forEach(items, function(item) {
				if ((item.price >= minPrice || !minPrice) && (item.price <= maxPrice || !maxPrice)) {
					out.push(item);
				}

			});
			return out;
		};
	})
	.controller('listController', ['$scope', 'listService', 'preferences', '$rootScope',
		function($scope, listService, preferences, $rootScope) {
			$scope.filter = {
				minPrice: undefined,
				maxPrice: undefined,
				stardDate: undefined,
				endDate: undefined,
				myProp: false,
				category: undefined,
				regionSearch: undefined
			};
			$scope.categories = $rootScope.categories;

			listService.getList().success(function(data) {
				$scope.proposals = data;
				console.log(data);
				console.log($rootScope.categories);

				}
			);
			$scope.setMyPropFilter = function () {
				if ($scope.filter.myProp) {
					$scope.filter.myPropEmail = preferences.get('user').email;
				} else {
					$scope.filter.myPropEmail = undefined;
				}
			};
			$scope.checkFilter = function () {
				console.log($scope.filter)
			};

		}]);