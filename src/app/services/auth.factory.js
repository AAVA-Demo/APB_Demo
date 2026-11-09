(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthFactory', ['$http', '$q', 'LocalStorageService', function($http, $q, LocalStorageService) {
      var factory = {};
      factory.isAuthenticated = function() {
        var token = LocalStorageService.get('authToken');
        var expiry = LocalStorageService.get('tokenExpiry');
        if (!token || !expiry) return false;
        return new Date().getTime() < parseInt(expiry);
      };
      factory.getToken = function() {
        return LocalStorageService.get('authToken');
      };
      factory.validateSession = function() {
        var deferred = $q.defer();
        if (this.isAuthenticated()) {
          deferred.resolve({ token: this.getToken() });
        } else {
          deferred.reject('Session expired');
        }
        return deferred.promise;
      };
      factory.mockLogin = function() {
        var token = 'mock-jwt-token-' + new Date().getTime();
        var expiry = new Date().getTime() + (15 * 60 * 1000);
        LocalStorageService.set('authToken', token);
        LocalStorageService.set('tokenExpiry', expiry.toString());
        LocalStorageService.set('userId', 'user123');
      };
      factory.logout = function() {
        LocalStorageService.remove('authToken');
        LocalStorageService.remove('tokenExpiry');
        LocalStorageService.remove('userId');
      };
      return factory;
    }]);
})();