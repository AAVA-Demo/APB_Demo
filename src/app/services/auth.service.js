(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
      const self = this;
      self.getUserId = function() {
        const userId = $window.localStorage.getItem('userId');
        return userId || 'user123';
      };
      self.isAuthenticated = function() {
        return !!$window.localStorage.getItem('authToken');
      };
      self.setAuthToken = function(token) {
        $window.localStorage.setItem('authToken', token);
      };
      self.setUserId = function(userId) {
        $window.localStorage.setItem('userId', userId);
      };
      self.logout = function() {
        $window.localStorage.removeItem('authToken');
        $window.localStorage.removeItem('userId');
      };
    }]);
})();