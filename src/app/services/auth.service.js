(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', '$http', function($window, $http) {
      const TOKEN_KEY = 'auth_token';
      this.initialize = function() {
        const token = $window.localStorage.getItem(TOKEN_KEY);
        if (token) {
          $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        } else {
          const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNjAwMDAwMDAwfQ.mock';
          $window.localStorage.setItem(TOKEN_KEY, mockToken);
          $http.defaults.headers.common['Authorization'] = 'Bearer ' + mockToken;
        }
      };
      this.getToken = function() {
        return $window.localStorage.getItem(TOKEN_KEY);
      };
      this.isAuthenticated = function() {
        return !!this.getToken();
      };
    }]);
})();