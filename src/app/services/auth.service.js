(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
      var token = $window.localStorage.getItem('authToken') || 'demo-token-12345';
      this.getToken = function() {
        return token;
      };
      this.validateToken = function() {
        var deferred = $q.defer();
        if (token) {
          deferred.resolve(true);
        } else {
          deferred.reject('No token found');
        }
        return deferred.promise;
      };
      this.setAuthHeader = function(config) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
        return config;
      };
    }])
    .factory('AuthInterceptor', ['AuthService', function(AuthService) {
      return {
        request: function(config) {
          if (config.url.indexOf('/api/') !== -1) {
            return AuthService.setAuthHeader(config);
          }
          return config;
        }
      };
    }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    }]);
})();