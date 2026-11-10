(function() {
  'use strict';
  angular.module('creditCardApp').factory('HttpInterceptorService', ['$q', 'AuthService', function($q, AuthService) {
    return {
      request: function(config) {
        if (AuthService.isAuthenticated()) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + AuthService.getToken();
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          console.error('Unauthorized request');
        }
        return $q.reject(rejection);
      }
    };
  }]);
})();