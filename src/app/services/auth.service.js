(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', function($window) {
      const TOKEN_KEY = 'cc_auth_token';
      const USER_KEY = 'cc_user_data';
      this.getToken = function() {
        return $window.localStorage.getItem(TOKEN_KEY) || 'mock-jwt-token-12345';
      };
      this.setToken = function(token) {
        $window.localStorage.setItem(TOKEN_KEY, token);
      };
      this.getCurrentUser = function() {
        const userData = $window.localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : { userId: 'user123', name: 'John Doe' };
      };
      this.setCurrentUser = function(user) {
        $window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      };
      this.logout = function() {
        $window.localStorage.removeItem(TOKEN_KEY);
        $window.localStorage.removeItem(USER_KEY);
      };
    }]);
})();