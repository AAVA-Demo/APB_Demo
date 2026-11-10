(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', [function() {
    var token = 'mock-jwt-token-12345';
    this.getToken = function() { return token; };
    this.setToken = function(newToken) { token = newToken; };
    this.isAuthenticated = function() { return !!token; };
  }]);
})();