(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', function($window) {
      var self = this;
      self.token = null;
      self.init = function() {
        self.token = $window.localStorage.getItem('authToken') || 'demo-token-12345';
        if (!$window.localStorage.getItem('authToken')) {
          $window.localStorage.setItem('authToken', self.token);
        }
      };
      self.getToken = function() {
        return self.token;
      };
      self.getUserId = function() {
        return 'user123';
      };
    }]);
})();