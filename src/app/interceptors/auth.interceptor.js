(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken') || 'mock-jwt-token';
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
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
})();