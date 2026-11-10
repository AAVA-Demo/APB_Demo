(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('authService', ['$window', '$http', function($window, $http) {
      var self = this;
      self.initialize = function() {
        var token = $window.localStorage.getItem('jwt_token');
        if (!token) {
          var mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UifQ.mock';
          $window.localStorage.setItem('jwt_token', mockToken);
        }
      };
      self.getToken = function() {
        return $window.localStorage.getItem('jwt_token');
      };
      self.validateSession = function() {
        return !!self.getToken();
      };
      self.logout = function() {
        $window.localStorage.removeItem('jwt_token');
      };
    }])
    .factory('authInterceptor', ['$window', '$q', function($window, $q) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('jwt_token');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            $window.localStorage.removeItem('jwt_token');
            $window.location.href = '/#/login';
          }
          return $q.reject(rejection);
        }
      };
    }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    }]);