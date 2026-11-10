(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$window', '$q', function($window, $q) {
    var self = this;
    self.getToken = function() {
      return $window.sessionStorage.getItem('authToken') || 'demo-token-12345';
    };
    self.setToken = function(token) {
      $window.sessionStorage.setItem('authToken', token);
    };
    self.isAuthenticated = function() {
      return !!self.getToken();
    };
    self.logout = function() {
      $window.sessionStorage.removeItem('authToken');
    };
  }]);
})();