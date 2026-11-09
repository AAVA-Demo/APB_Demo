(function() {
  'use strict';
  angular.module('creditCardApp').factory('authInterceptor', ['$q', 'authFactory', '$location', function($q, authFactory, $location) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        var token = authFactory.getToken();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  }]);
})();