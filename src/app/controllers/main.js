angular.module('myApp').controller('mainCtrl', function($scope, $http) {
	$scope.searchFields = {};


	// Set the last searched connection:
	var _dbPromise = idb.open('publictransportation', 1, upgradeDb => {
		upgradeDb.createObjectStore('connections', {'keyPath': 'id'});
	}).then(db => {
		return db.transaction('connections').objectStore('connections').getAll();
	}).then(connections => {
		$scope.connections = connections;
		$scope.searchFields.to = connections[0].to.location.name;
		$scope.searchFields.from = connections[0].from.location.name;
	});

	$scope.stations = function(cityName) {
		return $http.get('http://transport.opendata.ch/v1/locations?type=station&query=' + cityName)
			.then(function(response) {
				return response.data.stations.map(function(item){
					return item.name;
				});
			});
	};


	$scope.search = function () {
		// Store the last connection in IndexedDb to load it initially.
		
		/*dbPromise.then(db =>{
			var tx = db.transaction('people', 'readwrite');
			var peopleStore = tx.objectStore('people');
			var ageIndex = peopleStore.index('age');
			// Only show the onces that are 25
			//return ageIndex.getAll(25);
			// Show index
			//return ageIndex.getAll();
			// Show all by key
			return peopleStore.getAll();
		}).then(vals => { console.log(vals); })*/


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
			// Store in IndexedDb
			var _dbPromise = idb.open('publictransportation', 1, upgradeDb => {
				upgradeDb.createObjectStore('connections', {'keyPath': 'id'});
			}).then(db =>{
				var tx = db.transaction('connections', 'readwrite');
				var connectionStore = tx.objectStore('connections');
				connectionStore.clear();
				response.data.connections.forEach((con, i) => {
					con.id = i;
					connectionStore.put(con);
				});
				return tx.complete;
			}).then(() => {console.log('done')});
			$scope.connections = response.data.connections;
		}, function errorCallback(response) {
			console.log(response);
		});
	};

});