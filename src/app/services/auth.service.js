(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', '$q', function($window, $q) {
      var self = this;
      self.validateSession = function() {
        var deferred = $q.defer();
        var token = $window.sessionStorage.getItem('authToken');
        if (token) {
          deferred.resolve({ sessionValid: true, token: token });
        } else {
          var mockToken = 'mock-jwt-token-' + Date.now();
          $window.sessionStorage.setItem('authToken', mockToken);
          deferred.resolve({ sessionValid: true, token: mockToken });
        }
        return deferred.promise;
      };
      self.getToken = function() {
        return $window.sessionStorage.getItem('authToken');
      };
    }]);
})();