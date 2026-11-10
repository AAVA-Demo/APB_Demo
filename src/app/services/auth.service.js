(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthService', ['$window', '$q', function($window, $q) {
      var TOKEN_KEY = 'cc_auth_token';
      function isAuthenticated() {
        return !!$window.localStorage.getItem(TOKEN_KEY);
      }
      function mockLogin() {
        var token = 'mock_jwt_token_' + Date.now();
        $window.localStorage.setItem(TOKEN_KEY, token);
        return $q.resolve(token);
      }
      function getToken() {
        return $window.localStorage.getItem(TOKEN_KEY);
      }
      function logout() {
        $window.localStorage.removeItem(TOKEN_KEY);
      }
      return {
        isAuthenticated: isAuthenticated,
        mockLogin: mockLogin,
        getToken: getToken,
        logout: logout
      };
    }]);
})();