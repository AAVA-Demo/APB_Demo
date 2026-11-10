(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptor', ['$window', '$q', '$location', function($window, $q, $location) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401 || response.status === 403) {
            $window.localStorage.removeItem('authToken');
            $location.path('/login');
          }
          return $q.reject(response);
        }
      };
    }]);
})();