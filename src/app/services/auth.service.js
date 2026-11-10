(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', '$q', function($window, $q) {
      this.validateSession = function() {
        var deferred = $q.defer();
        var token = $window.localStorage.getItem('authToken');
        var expiresAt = $window.localStorage.getItem('tokenExpiresAt');
        if (token && expiresAt && new Date(expiresAt) > new Date()) {
          deferred.resolve(true);
        } else {
          this.setMockToken();
          deferred.resolve(true);
        }
        return deferred.promise;
      };
      this.setMockToken = function() {
        var mockToken = 'mock-jwt-token-' + Date.now();
        var expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2);
        $window.localStorage.setItem('authToken', mockToken);
        $window.localStorage.setItem('tokenExpiresAt', expiresAt.toISOString());
        $window.localStorage.setItem('userId', 'user-123');
      };
      this.getUserId = function() {
        return $window.localStorage.getItem('userId') || 'user-123';
      };
    }]);
})();