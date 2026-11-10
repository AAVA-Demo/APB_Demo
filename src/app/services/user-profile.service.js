(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('UserProfileService', ['$window', '$q', function($window, $q) {
      var self = this;
      self.authenticateUser = function() {
        var deferred = $q.defer();
        var token = $window.sessionStorage.getItem('authToken');
        if (!token) {
          token = 'mock-jwt-token-' + Date.now();
          $window.sessionStorage.setItem('authToken', token);
        }
        deferred.resolve({ userId: 'user-001', authToken: token });
        return deferred.promise;
      };
    }]);
})();