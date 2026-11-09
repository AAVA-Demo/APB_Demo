(function() {
  'use strict';
  angular.module('cardManagementModule')
    .factory('UserProfileFactory', ['$http', function($http) {
      var currentUser = { userId: 'user-001', name: 'John Doe' };
      return {
        getUserId: function() {
          return currentUser.userId;
        },
        getUserProfile: function() {
          return currentUser;
        }
      };
    }]);
})();