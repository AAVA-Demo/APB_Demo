(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
    const JWT_CONFIG = { tokenKey: 'cc_auth_token' };
    this.verifyAuth = function() {
      const deferred = $q.defer();
      const token = $window.sessionStorage.getItem(JWT_CONFIG.tokenKey);
      if (token) {
        deferred.resolve({ valid: true, token: token });
      } else {
        const mockToken = 'mock_jwt_token_' + Date.now();
        $window.sessionStorage.setItem(JWT_CONFIG.tokenKey, mockToken);
        deferred.resolve({ valid: true, token: mockToken });
      }
      return deferred.promise;
    };
    this.getToken = function() {
      return $window.sessionStorage.getItem(JWT_CONFIG.tokenKey);
    };
    this.setToken = function(token) {
      $window.sessionStorage.setItem(JWT_CONFIG.tokenKey, token);
    };
  }]);
})();