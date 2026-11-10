(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('HttpInterceptorService', ['$q', 'AuthService', 'toastr', function($q, AuthService, toastr) {
      return {
        request: function(config) {
          const token = AuthService.getToken();
          if (token && config.url.indexOf('/api/') !== -1) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            toastr.error('Authentication failed. Please login again.');
          } else if (rejection.status >= 500) {
            toastr.error('Server error. Please try again later.');
          } else if (rejection.status >= 400) {
            toastr.warning(rejection.data?.message || 'Request failed.');
          }
          console.error('HTTP Error:', rejection);
          return $q.reject(rejection);
        }
      };
    }]);
})();