(function() {
  'use strict';
  angular.module('creditCardApp').factory('AuthInterceptor', AuthInterceptor);
  AuthInterceptor.$inject = ['$q', '$window'];
  function AuthInterceptor($q, $window) {
    return {
      request: function(config) {
        var token = $window.localStorage.getItem('authToken') || 'demo-token-12345';
        if (token) {
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
  }
})();