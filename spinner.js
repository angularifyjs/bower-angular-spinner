/**
 * angular-spinner v1.2.26 - 2014-11-02
 * @link https://github.com/angularifyjs/angular-spinner
 * @license MIT - Copyright (c) 2014 Angularfiy.org & HenryTao.
 */
angular.module('angular-spinner', []).factory('SpinnerConfig', function() {
  return {
    '_START_REQUEST_': '_START_REQUEST_',
    '_END_REQUEST_': '_END_REQUEST_',
    'isSpinning': false,
    'pendingRequests': 0
  };

}).factory('SpinnerInterceptor', ["SpinnerConfig", "$injector", "$q", "$timeout", function(SpinnerConfig, $injector, $q, $timeout) {
  var $rootScope, $http;
  var spinnerCallback = function() {
    SpinnerConfig.pendingRequests = $http.pendingRequests.length;
    if ($http.pendingRequests.length < 1) {
      $rootScope.$broadcast(SpinnerConfig['_END_REQUEST_']);
    } else {
      if (!SpinnerConfig.isSpinning) {
        $rootScope.$broadcast(SpinnerConfig['_START_REQUEST_']);
      }
    }
  };

  return {
    request: function(config) {
      $http = $http || $injector.get('$http');
      $rootScope = $rootScope || $injector.get('$rootScope');
      $rootScope.$broadcast(SpinnerConfig['_START_REQUEST_']);
      return config;
    },
    requestError: function(rejection) {
      spinnerCallback();
      return $q.reject(rejection);
    },
    response: function(response) {
      spinnerCallback();
      return response;
    },
    responseError: function(rejection) {
      spinnerCallback();
      return $q.reject(rejection);
    }
  };

}]).config(["$httpProvider", function($httpProvider) {
  $httpProvider.interceptors.push('SpinnerInterceptor');

}]).run(["SpinnerConfig", "$rootScope", function(SpinnerConfig, $rootScope) {
  $rootScope.$on(SpinnerConfig['_START_REQUEST_'], function() {
    SpinnerConfig.isSpinning = true;
  });
  $rootScope.$on(SpinnerConfig['_END_REQUEST_'], function() {
    SpinnerConfig.isSpinning = false;
  });

}]).directive('spinner', ["SpinnerConfig", function(SpinnerConfig) {
  var showElement = function($element) {
    $element.css('display', $element.data('__display') || 'inline');
  };
  var hideElement = function($element) {
    $element.data('__display', $element.css('display'));
    $element.css('display', 'none');
  };
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      if (SpinnerConfig.isSpinning) {
        showElement($element);
      } else {
        hideElement($element);
      }
      $scope.$on(SpinnerConfig['_START_REQUEST_'], function() {
        showElement($element);
      });
      $scope.$on(SpinnerConfig['_END_REQUEST_'], function() {
        hideElement($element);
      });
    }
  };

}]);