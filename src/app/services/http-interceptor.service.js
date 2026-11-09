(function() {
  'use strict';
  angular.module('creditCardApp').factory('HttpInterceptorService', ['$q', '$injector', function($q, $injector) {
    return {
      request: function(config) {
        var token = localStorage.getItem('authToken');
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
  HttpInterceptorService.$inject = ['$q', '$injector'];
})();