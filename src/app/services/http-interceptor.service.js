(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('HttpInterceptorService', ['$q', 'AuthService', function($q, AuthService) {
      return {
        request: function(config) {
          const token = AuthService.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          const status = rejection.status;
          let message = 'An error occurred';
          if (status === 401) {
            message = 'Unauthorized. Please login again.';
          } else if (status === 403) {
            message = 'Access forbidden.';
          } else if (status === 404) {
            message = 'Resource not found.';
          } else if (status >= 500) {
            message = 'Server error. Please try again later.';
          }
          toastr.error(message);
          console.error('HTTP Error:', rejection);
          return $q.reject(rejection);
        }
      };
    }]);
})();