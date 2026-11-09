(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthService', ['$window', '$http', function($window, $http) {
      var token = $window.sessionStorage.getItem('authToken') || 'mock-jwt-token-12345';
      return {
        authenticate: function() {
          if (!token) {
            token = 'mock-jwt-token-12345';
            $window.sessionStorage.setItem('authToken', token);
          }
          return token;
        },
        isAuthenticated: function() {
          return !!token;
        },
        getToken: function() {
          return token;
        },
        logout: function() {
          token = null;
          $window.sessionStorage.removeItem('authToken');
        }
      };
    }])
    .factory('AuthInterceptor', ['$window', 'AuthService', function($window, AuthService) {
      return {
        request: function(config) {
          var token = AuthService.getToken();
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        }
      };
    }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    }]);
})();