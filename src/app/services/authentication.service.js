(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthenticationService', ['$http', '$window', '$q', function($http, $window, $q) {
      const TOKEN_KEY = 'auth_token';
      const USER_KEY = 'user_id';
      this.validateSession = function() {
        const token = $window.localStorage.getItem(TOKEN_KEY);
        const userId = $window.localStorage.getItem(USER_KEY);
        if (!token || !userId) {
          const mockToken = 'mock-jwt-token-' + Date.now();
          const mockUserId = 'user-' + Math.floor(Math.random() * 1000);
          $window.localStorage.setItem(TOKEN_KEY, mockToken);
          $window.localStorage.setItem(USER_KEY, mockUserId);
          return $q.resolve({token: mockToken, userId: mockUserId});
        }
        return $q.resolve({token: token, userId: userId});
      };
      this.getToken = function() {
        return $window.localStorage.getItem(TOKEN_KEY);
      };
      this.getUserId = function() {
        return $window.localStorage.getItem(USER_KEY);
      };
      this.logout = function() {
        $window.localStorage.removeItem(TOKEN_KEY);
        $window.localStorage.removeItem(USER_KEY);
      };
    }]);
})();