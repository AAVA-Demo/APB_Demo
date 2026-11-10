(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthService', ['$window', '$q', function($window, $q) {
      var currentUser = { userId: 'user123', name: 'John Doe' };
      return {
        validateUser: function() {
          var deferred = $q.defer();
          if (currentUser.userId) {
            deferred.resolve(currentUser);
          } else {
            deferred.reject('User not authenticated');
          }
          return deferred.promise;
        },
        getCurrentUser: function() {
          return currentUser;
        }
      };
    }]);
})();