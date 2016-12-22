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
	.filter('date', function() {
		return function(items, filterStartDate, filterEndDate) {
			var out = [];

            console.log (filterStartDate);
            var filterStart = new Date(filterStartDate).getTime();
            var filterEnd = new Date(filterEndDate).getTime();
			angular.forEach(items, function(item) {
			    var startDate = item.startTime.substr(0, 16).replace(/-/g, "/").replace("T", " ");
                console.log(startDate);
			    startDate = new Date(startDate).getTime();
                console.log(startDate);
                if (item.endTime) {
                    var endDate = item.endTime.substr(0, 16).replace(/-/g, "/").replace("T", " ");
                    endDate = new Date(endDate).getTime();
                }
				if ((startDate >= filterStart || !filterStart) && (startDate <= filterEnd || !filterEnd) &&
                    (endDate <= filterEnd || (!endDate || !filterEnd)) && (endDate <= filterStart || (!endDate || !filterStart))) {
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
                myResp: false
			};
			$scope.categories = $rootScope.categories;

			listService.getList().success(function(data) {
				$scope.proposals = data;
                $scope.proposals.startTime = dateToView($scope.proposals.startTime);
                $scope.proposals.endTime = dateToView($scope.proposals.endTime);

				console.log($scope.proposals.startTime);
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

			var dateToView = function (date) {
			    console.log(date)
                if (date) {
                    var viewDate = date.substr(0, 16).replace(/-/g, "/").replace("T", " ");
                } else {viewDate = date;}
                console.log(viewDate)
                return viewDate;
            }

		}]);