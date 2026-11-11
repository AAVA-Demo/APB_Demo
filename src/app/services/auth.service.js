(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', function($window) {
      var self = this;
      self.getToken = function() {
        return $window.localStorage.getItem('authToken') || 'mock-jwt-token-12345';
      };
      self.setToken = function(token) {
        $window.localStorage.setItem('authToken', token);
      };
      self.clearToken = function() {
        $window.localStorage.removeItem('authToken');
      };
      self.isAuthenticated = function() {
        return !!self.getToken();
      };
    }]);
})();