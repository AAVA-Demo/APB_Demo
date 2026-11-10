(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('httpInterceptor', ['$q', '$rootScope', httpInterceptor]);

  function httpInterceptor($q, $rootScope) {
    return {
      request: request,
      responseError: responseError
    };

    function request(config) {
      var token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }

    function responseError(rejection) {
      if (rejection.status === 401) {
        $rootScope.$broadcast('auth:unauthorized');
      } else if (rejection.status >= 500) {
        $rootScope.$broadcast('http:serverError', rejection);
      }
      return $q.reject(rejection);
    }
  }
})();