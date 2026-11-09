(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptorService', ['$q', '$window', AuthInterceptorService]);

  function AuthInterceptorService($q, $window) {
    var service = {
      request: request,
      responseError: responseError
    };
    return service;

    function request(config) {
      config.headers = config.headers || {};
      var token = $window.sessionStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }

    function responseError(rejection) {
      if (rejection.status === 401) {
        $window.location.href = '/login';
      }
      return $q.reject(rejection);
    }
  }
})();