(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptor', ['$q', 'AuthService', function($q, AuthService) {
      return {
        request: function(config) {
          if (config.url.indexOf('/api/') !== -1) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + AuthService.getToken();
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