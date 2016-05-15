var adminApp = angular.module('adminApp', ['ngRoute']);

adminApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/adminAddSensors', {
        templateUrl: '../partials/adminAddSensor.ejs',
        controller: 'AddSensorController'
    }).when('/', {
        templateUrl: '../partials/adminDashboardSummary.ejs',
        controller: 'DashboardSummaryController'
    }).when('/getUserSensors', {
        templateUrl: '../partials/userSensorPage.ejs',
        controller: 'UserSensorController'
    })
}]);


adminApp.controller("DashboardSummaryController", [ "$scope", "$http","$location", function($scope, $http, $location) {
			console.log("inside DashboardSummaryController");
			$http.get('/getDashboardSummary').then(function(result) {
			/*console.log(result.data.configCount[0].configCount);
			$scope.configCount = result.data.configCount[0].configCount;
			$scope.sensorcount = result.data.sensorcount[0].sensorcount;*/
			$location.path('/');
			});

		} ]);



adminApp.controller("AddSensorController", [ "$scope", "$http", "$location",
		function($scope, $http, $location) {
			console.log("inside AddSensorController ");
			
			
			$scope.adminAddSensor = function() {
				console.log("sensor"+$scope.sensorid);
			$http.post('/adminAddSensor' , {
				 "sensorid" : $scope.sensorid,
				 "sensorname" : $scope.sensorname,
				 "sensortype" : $scope.sensortype,
				 "location" : $scope.sensorlocation,
				 "manufacturer" : $scope.manufacturer
			 }).then(function(result) {
				console.log(result);
				$scope.sensorList = result.data;
				$location.path('/addsensors',"Success");
			});
			}
			
			
		} ]);
