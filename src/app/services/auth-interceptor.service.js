(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthInterceptorService', ['$q', '$injector', AuthInterceptorService]);
  function AuthInterceptorService($q, $injector) {
    var service = {};
    service.request = function(config) {
      config.headers = config.headers || {};
      var token = 'mock-jwt-token-12345';
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    };
    service.responseError = function(rejection) {
      if (rejection.status === 401) {
        toastr.error('Unauthorized access. Please login.', 'Authentication Error');
      } else if (rejection.status === 500) {
        toastr.error('Server error. Please try again later.', 'Error');
      } else if (rejection.status === -1) {
        console.log('API call failed, using mock data');
      }
      return $q.reject(rejection);
    };
    return service;
  }
})();