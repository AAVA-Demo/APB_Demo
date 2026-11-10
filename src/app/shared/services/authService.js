(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('authService', ['$window', '$q', function($window, $q) {
      var self = this;
      self.getCurrentUser = function() {
        var deferred = $q.defer();
        var user = $window.localStorage.getItem('currentUser');
        if (user) {
          deferred.resolve(JSON.parse(user));
        } else {
          var mockUser = {userId: 'user123', name: 'John Doe', token: 'mock-jwt-token'};
          $window.localStorage.setItem('currentUser', JSON.stringify(mockUser));
          deferred.resolve(mockUser);
        }
        return deferred.promise;
      };
      self.getToken = function() {
        return self.getCurrentUser().then(function(user) {
          return user.token;
        });
      };
    }]);
})();