(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthFactory', ['$http', '$window', function($http, $window) {
      var factory = {};
      factory.getToken = function() {
        return $window.localStorage.getItem('authToken') || 'mock-jwt-token-12345';
      };
      factory.setToken = function(token) {
        $window.localStorage.setItem('authToken', token);
      };
      factory.isAuthenticated = function() {
        return !!factory.getToken();
      };
      factory.logout = function() {
        $window.localStorage.removeItem('authToken');
      };
      return factory;
    }])
    .factory('AuthInterceptor', ['AuthFactory', function(AuthFactory) {
      return {
        request: function(config) {
          if (config.url.indexOf('/api/') !== -1) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + AuthFactory.getToken();
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401) {
            AuthFactory.logout();
            window.location.href = '#/login';
          }
          return Promise.reject(response);
        }
      };
    }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    }]);
})();