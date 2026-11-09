(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('HttpInterceptorService', ['$q', 'AuthService', '$injector', function($q, AuthService, $injector) {
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
            console.error('Unauthorized access');
          } else if (rejection.status === 500) {
            console.error('Server error');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();