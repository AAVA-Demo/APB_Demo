(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptor', ['$window', '$q', function($window, $q) {
      return {
        request: function(config) {
          const token = $window.localStorage.getItem('authToken');
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
    }]);
})();