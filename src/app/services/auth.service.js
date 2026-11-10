(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
      var self = this;
      self.validateSession = function() {
        var token = $window.sessionStorage.getItem('authToken');
        if (token) {
          return $q.resolve({ valid: true, userId: $window.sessionStorage.getItem('userId') });
        }
        return $q.reject({ valid: false });
      };
      self.getUserId = function() {
        return $window.sessionStorage.getItem('userId') || 'user-123';
      };
    }]);
})();