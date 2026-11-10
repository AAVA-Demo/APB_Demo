(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', '$http', function($window, $http) {
      var self = this;
      self.getToken = function() {
        return $window.localStorage.getItem('authToken') || 'mock-token-12345';
      };
      self.setToken = function(token) {
        $window.localStorage.setItem('authToken', token);
      };
      self.isAuthenticated = function() {
        return !!self.getToken();
      };
      self.getUserId = function() {
        return $window.localStorage.getItem('userId') || 'user-001';
      };
    }]);
})();