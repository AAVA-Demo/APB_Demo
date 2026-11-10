(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
    var self = this;
    self.getToken = function() {
      return $window.localStorage.getItem('authToken') || 'mock-jwt-token-12345';
    };
    self.setToken = function(token) {
      $window.localStorage.setItem('authToken', token);
    };
    self.clearToken = function() {
      $window.localStorage.removeItem('authToken');
    };
    self.isAuthenticated = function() {
      return !!self.getToken();
    };
  }]).factory('authInterceptor', ['$q', 'AuthService', function($q, AuthService) {
    return {
      request: function(config) {
        var token = AuthService.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          AuthService.clearToken();
        }
        return $q.reject(rejection);
      }
    };
  }]);
})();