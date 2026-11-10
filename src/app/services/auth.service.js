(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', '$q', function($window, $q) {
      var self = this;
      self.validateUser = function() {
        var deferred = $q.defer();
        var token = $window.localStorage.getItem('authToken');
        if (token) {
          var userId = $window.localStorage.getItem('userId') || 'user123';
          deferred.resolve(userId);
        } else {
          var mockUserId = 'user123';
          $window.localStorage.setItem('userId', mockUserId);
          $window.localStorage.setItem('authToken', 'mock-jwt-token');
          deferred.resolve(mockUserId);
        }
        return deferred.promise;
      };
      self.getToken = function() {
        return $window.localStorage.getItem('authToken');
      };
    }]);
})();