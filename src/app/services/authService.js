(function() {
  'use strict';
  angular.module('ccApp').service('AuthService', ['$window', '$http', function($window, $http) {
    var self = this;
    self.token = null;
    self.authenticate = function() {
      self.token = $window.localStorage.getItem('jwt_token');
      if (!self.token) {
        self.token = 'mock-jwt-token-' + Date.now();
        $window.localStorage.setItem('jwt_token', self.token);
      }
      return self.token;
    };
    self.isAuthenticated = function() {
      return !!($window.localStorage.getItem('jwt_token'));
    };
    self.getToken = function() {
      return $window.localStorage.getItem('jwt_token');
    };
    self.logout = function() {
      $window.localStorage.removeItem('jwt_token');
      self.token = null;
    };
    self.authenticate();
  }]);
})();