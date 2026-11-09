(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserService', ['$http', '$q', function($http, $q) {
      var currentUser = { userId: 'user-001', name: 'John Doe', email: 'john.doe@example.com' };
      return {
        getCurrentUser: function() {
          return $q.resolve(currentUser);
        },
        getUserId: function() {
          return currentUser.userId;
        }
      };
    }]);
})();