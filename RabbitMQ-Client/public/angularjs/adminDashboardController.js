var doctorApp = angular.module('doctorApp', ['ngRoute']);

doctorApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/profileMgmt', {
        templateUrl: '../partials/adminAddSensor.ejs',
        controller: 'AdminAddSensorController'
    }).when('/', {
        templateUrl: '../partials/adminDashboardSummary.ejs',
        controller: 'DashboardSummaryController'
    }).when('/getUserSensors', {
        templateUrl: '../partials/userSensorPage.ejs',
        controller: 'UserSensorController'
    }).when('/customermgmt', {
        templateUrl: '../partials/customerListPage.ejs',
        controller: 'AddSensorController'
    })
}]);


doctorApp.controller("DashboardSummaryController", [ "$scope", "$http","$location", function($scope, $http, $location) {
			console.log("inside DashboardSummaryController");
			$http.get('/getDashboardSummary').then(function(result) {
			$location.path('/');
			});

		} ]);



doctorApp.controller("AdminAddSensorController", [ "$scope", "$http", "$location",
		function($scope, $http, $location) {
			console.log("inside AddSensorController ");
			
			
			$scope.adminAddSensor = function() {
				console.log("sensor"+$scope.sensorid);
			$http.post('/adminAddSensor' , {
				 "sensorid" : $scope.sensorid,
				 "sensorname" : $scope.sensorname,
				 "sensortype" : $scope.sensortype,
				 "location" : $scope.location,
				 "manufacturer" : $scope.manufacturer
			 }).then(function(result) {
				console.log(result);
				$scope.sensorList = result.data;
				$location.path('/addsensors',"Success");
			});
			}
			
			
		} ]);


doctorApp.controller("AddSensorController", [ "$scope", "$http", "$location",
		function($scope, $http, $location) {
			console.log("inside AddSensorController ");

			$http.get('/getSensorList').then(function(result) {
				console.log(result);
				$scope.sensorList = result.data;
				$location.path('/addsensors');
			});

		} ]);