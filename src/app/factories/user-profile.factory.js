(function() {
  'use strict';
  angular.module('creditCardApp').factory('UserProfileFactory', ['$resource', '$window', function($resource, $window) {
    
    return {
      getUserProfile: function() {
        const user = $window.localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : { userId: 'user123', name: 'Demo User' };
      },
      
      updateProfile: function(profile) {
        $window.localStorage.setItem('currentUser', JSON.stringify(profile));
      }
    };
  }]);
})();