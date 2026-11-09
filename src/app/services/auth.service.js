(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$window', '$q', '$http', function($window, $q, $http) {
    var self = this;
    self.getToken = function() {
      return $window.localStorage.getItem('authToken') || 'mock-jwt-token-12345';
    };
    self.setToken = function(token) {
      $window.localStorage.setItem('authToken', token);
    };
    self.getUserId = function() {
      return $window.localStorage.getItem('userId') || 'user-001';
    };
    self.isAuthenticated = function() {
      return !!self.getToken();
    };
    self.logout = function() {
      $window.localStorage.removeItem('authToken');
      $window.localStorage.removeItem('userId');
    };
  }]);
})();