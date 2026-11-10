(function() {
  'use strict';
  angular.module('creditCardApp').factory('HttpInterceptorService', HttpInterceptorService);
  HttpInterceptorService.$inject = ['$q', 'NotificationService'];
  function HttpInterceptorService($q, NotificationService) {
    return {
      request: function(config) {
        var token = localStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        console.error('HTTP Error:', rejection);
        if (rejection.status >= 400 && rejection.status < 600) {
          NotificationService.error('An error occurred. Please try again.');
        }
        return $q.reject(rejection);
      }
    };
  }
})();