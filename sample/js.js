angular.module('app', [
	'angular-spinner'

]).controller('AppCtrl', function(SpinnerConfig, $http, $scope){
	$scope.SpinnerConfig = SpinnerConfig;
	$scope.sendRequest = function(){
		for(var i = 0; i < 200; i++){
			$http.get('https://ajax.googleapis.com/ajax/libs/angularjs/1.3.1/angular.min.js');
		}
	};

	$scope.$on(SpinnerConfig['_START_REQUEST_'], function() {
    // To-do
  });
  $scope.$on(SpinnerConfig['_END_REQUEST_'], function() {
    // To-do
  });
});