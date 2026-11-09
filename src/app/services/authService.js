(function() {
  'use strict';
  angular.module('creditCardApp').service('authService', ['$http', '$window', '$q', function($http, $window, $q) {
    const TOKEN_KEY = 'auth_token';
    this.validateSession = function() {
      const deferred = $q.defer();
      const token = $window.localStorage.getItem(TOKEN_KEY);
      if (token) {
        deferred.resolve(token);
      } else {
        const mockToken = 'mock-jwt-token-' + Date.now();
        $window.localStorage.setItem(TOKEN_KEY, mockToken);
        deferred.resolve(mockToken);
      }
      return deferred.promise;
    };
    this.getToken = function() {
      return $window.localStorage.getItem(TOKEN_KEY);
    };
    this.setToken = function(token) {
      $window.localStorage.setItem(TOKEN_KEY, token);
    };
  }]);
  angular.module('creditCardApp').factory('authInterceptor', ['$q', '$window', function($q, $window) {
    return {
      request: function(config) {
        const token = $window.localStorage.getItem('auth_token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $window.localStorage.removeItem('auth_token');
        }
        return $q.reject(rejection);
      }
    };
  }]);
  angular.module('creditCardApp').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);
})();