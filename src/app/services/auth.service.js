(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
      var self = this;
      this.validateSession = function() {
        var token = $window.sessionStorage.getItem('authToken');
        var userId = $window.sessionStorage.getItem('userId');
        if (!token || !userId) {
          var mockToken = 'mock-jwt-token-' + Date.now();
          var mockUserId = 'user-' + Math.floor(Math.random() * 1000);
          $window.sessionStorage.setItem('authToken', mockToken);
          $window.sessionStorage.setItem('userId', mockUserId);
          return $q.resolve({ userId: mockUserId, token: mockToken });
        }
        return $q.resolve({ userId: userId, token: token });
      };
      this.getUserId = function() {
        return $window.sessionStorage.getItem('userId');
      };
      this.getToken = function() {
        return $window.sessionStorage.getItem('authToken');
      };
    }]);
})();