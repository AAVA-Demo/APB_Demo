(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', function($window) {
      const TOKEN_KEY = 'jwt_token';
      const USER_KEY = 'user_id';
      this.setToken = function(token) {
        $window.localStorage.setItem(TOKEN_KEY, token);
      };
      this.getToken = function() {
        return $window.localStorage.getItem(TOKEN_KEY) || 'mock-jwt-token-12345';
      };
      this.setUserId = function(userId) {
        $window.localStorage.setItem(USER_KEY, userId);
      };
      this.getUserId = function() {
        return $window.localStorage.getItem(USER_KEY) || 'user-001';
      };
      this.clearAuth = function() {
        $window.localStorage.removeItem(TOKEN_KEY);
        $window.localStorage.removeItem(USER_KEY);
      };
    }]);
})();