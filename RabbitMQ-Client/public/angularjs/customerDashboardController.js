var customerApp = angular.module('customerApp', ['ngRoute' , 'ngSanitize'] );

customerApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/addsensors', {
        templateUrl: '../partials/addSensorPage.ejs',
        controller: 'AddSensorController'
    }).when('/', {
        templateUrl: '../partials/dashboardSummary.ejs',
        controller: 'DashboardSummaryController'
    }).when('/getUserSensors', {
        templateUrl: '../partials/userSensorPage.ejs',
        controller: 'UserSensorController'
    }).when('/subscribeSensor', {
        templateUrl: '../partials/userSensorPage.ejs',
        controller: 'UserSensorController'
    })/*.when('/sensorData', {
        templateUrl: '../partials/sensorDataResultsPage.ejs',
        controller: 'UserSensorController'
    })*/
}]);


customerApp.controller("DashboardSummaryController", [ "$scope", "$http","$location", function($scope, $http, $location) {
			console.log("inside DashboardSummaryController");
			$http.get('/getDashboardSummary').then(function(result) {
			console.log(result.data.configCount[0].configCount);
			$scope.configCount = result.data.configCount[0].configCount;
			$scope.sensorcount = result.data.sensorcount[0].sensorcount;
			//$location.path('/');
			});

		} ]);

customerApp.controller('dashBoardController', function($scope, $http) {
	console.log("inside dashBoardController ");
	/*$http({
		 method: "GET",
		 url : '/getCustomerDashboardData',
	 }).success(function(data) {
		 if(data.statusCode=="profileData"){
			 console.log("followers "+data.myFollowers);
			 $scope.followers = data.countData.myFollowers;
			 $scope.following = data.countData.meFollowing;
		 }
		 else if (data.statusCode == "invalidLogin"){
			 $scope.existingUserName = false;
		 } 
	 }).error(function(error) {
			$scope.unexpected_error = false;
		});*/
	
});


customerApp.controller("AddSensorController", [ "$scope", "$http", "$location",
		function($scope, $http, $location) {
			console.log("inside AddSensorController ");

			$http.get('/getSensorList').then(function(result) {
				console.log(result);
				$scope.sensorList = result.data;
				$location.path('/addsensors');
			});
			
			$scope.subscribeSensor = function(sensor) {
				$http.post('/subscribeSensor', {"sensor" : sensor}).then(function(result) {
					console.log(result);
					window.alert("User Subscribed Succesfully.!!")
					$location.path('/addsensors');
				});
			}
			
			
		} ]);


customerApp.controller("UserSensorController", [ "$scope", "$http", "$location", "$sce" , 
    		function($scope, $http, $location,$sce) {
				$scope.hideSenorData = true;
				$scope.hideSensorList = true;
				$scope.isDisabled = false;
    			console.log("inside UserSensorController ");

    			$http.get('/getUserSensorList').then(function(result) {
    				console.log(result);
    				$scope.usersensorList = result.data;
    				$scope.hideSenorData = true;
    				$scope.hideSensorList = false;
    				$location.path('/getUserSensors');
    			});
    			
    			$scope.getSensorData = function(sensor) {
    				console.log("inside getSensorData "+sensor.sensorname);
    			
    			$http.get('/getSensorData', {params: {sensor: sensor}}).then(function(result) {
    				console.log(result);
    				var results  = result.data;
    				$scope.mean  = results.mean;
    				$scope.deviation  = results.standardDeviation;
    				$scope.median = results.median
    				 $scope.trustSrc = function(src) {
    					    return $sce.trustAsResourceUrl(src);
    					  }
    				$scope.plotly = results.plot;
    				$scope.hideSenorData = false;
    				$scope.hideSensorList = true;
    				//$location.path('/sensorData');
    			});
    			}
    		} ]);