angular.module('myApp').controller('mainCtrl', function($scope, $http) {
	$scope.searchFields = {};

	$scope.stations = function(cityName) {
		return $http.get('http://transport.opendata.ch/v1/locations?type=station&query=' + cityName)
			.then(function(response) {
				return response.data.stations.map(function(item){
					return item.name;
				});
			});
	};


	$scope.search = function () {
		// Create the date and time parameters
		// date	Date of the connection, in the format YYYY-MM-DD	2012-03-25
		// time	Time of the connection, in the format hh:mm			17:30
		var d = '';
		if ($scope.searchFields.date == undefined) {
			d = new Date();
		} else {
			d = new Date($scope.searchFields.date);
		}
		var date = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getDate();
		var time = '';
		if (d.getMinutes() < 10) {
			time = d.getHours() + ':0' + d.getMinutes();
		} else {
			time = d.getHours() + ':' + d.getMinutes();
		}
		// Get connections from transport.opendata.ch
		$http.get('http://transport.opendata.ch/v1/connections', {
			params: {
				'from': $scope.searchFields.from, 
				'to': $scope.searchFields.to,
				'date': date,
				'time': time
			}
		}).then(function successCallback(response) {
			$scope.connections = response.data.connections;

		}, function errorCallback(response) {
			console.log(response);
		});
	};

});