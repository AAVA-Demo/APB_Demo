(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$window', '$http', function($window, $http) {
    var self = this;
    self.getToken = function() {
      return $window.localStorage.getItem('authToken') || 'mock-jwt-token-12345';
    };
    self.setToken = function(token) {
      $window.localStorage.setItem('authToken', token);
    };
    self.getAuthHeaders = function() {
      return {
        'Authorization': 'Bearer ' + self.getToken(),
        'Content-Type': 'application/json'
      };
    };
    self.getUserId = function() {
      return $window.localStorage.getItem('userId') || 'user-001';
    };
  }]);
  angular.module('creditCardApp').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$q', 'AuthService', function($q, AuthService) {
      return {
        request: function(config) {
          if (config.url.indexOf('/api/') !== -1) {
            config.headers = config.headers || {};
            angular.extend(config.headers, AuthService.getAuthHeaders());
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.error('Unauthorized access');
          }
          return $q.reject(rejection);
        }
      };
    }]);
  }]);
})();