(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
      const TOKEN_KEY = 'cc_auth_token';
      const USER_KEY = 'cc_user_id';
      this.validateSession = function() {
        const token = $window.sessionStorage.getItem(TOKEN_KEY);
        const userId = $window.sessionStorage.getItem(USER_KEY);
        if (token && userId) {
          return $q.resolve({ token: token, userId: userId });
        }
        const mockToken = 'mock_jwt_token_' + Date.now();
        const mockUserId = 'user_' + Math.floor(Math.random() * 1000);
        $window.sessionStorage.setItem(TOKEN_KEY, mockToken);
        $window.sessionStorage.setItem(USER_KEY, mockUserId);
        return $q.resolve({ token: mockToken, userId: mockUserId });
      };
      this.getToken = function() {
        return $window.sessionStorage.getItem(TOKEN_KEY);
      };
      this.getUserId = function() {
        return $window.sessionStorage.getItem(USER_KEY);
      };
      this.logout = function() {
        $window.sessionStorage.removeItem(TOKEN_KEY);
        $window.sessionStorage.removeItem(USER_KEY);
      };
    }]);
})();