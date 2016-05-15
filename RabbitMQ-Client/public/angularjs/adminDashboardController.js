var adminApp = angular.module('adminApp', ['ngRoute']);

adminApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/adminAddSensors', {
        templateUrl: '../partials/adminAddSensor.ejs',
        controller: 'AdminAddSensorController'
    }).when('/', {
        templateUrl: '../partials/adminDashboardSummary.ejs',
        controller: 'DashboardSummaryController'
    }).when('/getUserSensors', {
        templateUrl: '../partials/userSensorPage.ejs',
        controller: 'UserSensorController'
    }).when('/addsensors', {
        templateUrl: '../partials/adminSensorListPage.ejs',
        controller: 'AddSensorController'
    })
}]);


adminApp.controller("DashboardSummaryController", [ "$scope", "$http","$location", function($scope, $http, $location) {
			console.log("inside DashboardSummaryController");
			$http.get('/getDashboardSummary').then(function(result) {
			$location.path('/');
			});

		} ]);



adminApp.controller("AdminAddSensorController", [ "$scope", "$http", "$location",
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


adminApp.controller("AddSensorController", [ "$scope", "$http", "$location",
		function($scope, $http, $location) {
			console.log("inside AddSensorController ");

			$http.get('/getSensorList').then(function(result) {
				console.log(result);
				$scope.sensorList = result.data;
				$location.path('/addsensors');
			});

		} ]);