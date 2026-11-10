(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_BASE_URL', 'https://api.creditcard.demo.com')
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
    }])
    .factory('httpInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            $window.location.href = '#/login';
          }
          console.error('HTTP Error:', rejection);
          return $q.reject(rejection);
        }
      };
    }]);
})();