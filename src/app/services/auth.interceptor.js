(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken') || 'demo-token-12345';
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            $window.location.href = '/login';
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();