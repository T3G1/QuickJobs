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
	.filter('time', function() {
		return function(items, filterStartDate, filterEndDate) {
			var out = [];

            console.log (filterStartDate);
            var filterStart = new Date(filterStartDate).getTime();
            var filterEnd = new Date(filterEndDate).getTime();
			angular.forEach(items, function(item) {
				var startDate = new Date(item.startTime).getTime();
				if (item.endTime) {
					var endDate = new Date(item.endTime).getTime();
				}
				if ((startDate >= filterStart || !filterStart) && (startDate <= filterEnd || !filterEnd) &&
                    (endDate <= filterEnd || (!endDate || !filterEnd)) && (endDate >= filterStart || (!endDate || !filterStart))) {
					out.push(item);
				}
			});
			return out;
		};
	})
    .filter('myResp', function() {
    return function(items, isFiltered) {
        var out = [];

        if (!isFiltered) {
            out = items
        } else {

            angular.forEach(items, function (item) {
                if (item.hasMyResponse) {
                    out.push(item);
                }
            });
        }
        return out;
    };
})
	.controller('listController', ['$scope', 'listService', 'preferences', '$rootScope',
		function($scope, listService, preferences, $rootScope) {
			$scope.filter = {
				minPrice: undefined,
				maxPrice: undefined,
				startDate: undefined,
				endDate: undefined,
				myProp: false,
				category: undefined,
				regionSearch: undefined,
				nameSearch: undefined,
                myResp: false
			};
			$scope.categories = $rootScope.categories;

			listService.getList().success(function(data) {
				$scope.proposals = data;

				console.log($scope.proposals.startTime);
				console.log($rootScope.categories);
				}
			);
var filtered = false;
            $scope.filter.myPropEmail = '';
			$scope.setMyPropFilter = function () {
                if(!filtered){
                    if ($scope.filter.myProp) {
                        if(preferences.get('user')){
                            $scope.filter.myPropEmail = preferences.get('user').email;
                        }
                        $scope.filter.myPropEmail = ' ';
                    } else {
                        $scope.filter.myPropEmail = ' ';
                    }
                }
				else{
                    $scope.filter.myPropEmail = '';
                }
                filtered = !filtered;
			};

			$scope.checkFilter = function () {
				console.log($scope.filter)
			};

		}]);