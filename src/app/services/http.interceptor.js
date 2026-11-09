(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('httpInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.sessionStorage.getItem('authToken');
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