(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptor', ['$window', '$q', function($window, $q) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.error('Unauthorized access - redirecting to login');
          } else if (rejection.status >= 500) {
            console.error('Server error:', rejection);
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();