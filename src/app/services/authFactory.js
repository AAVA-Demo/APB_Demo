(function() {
  'use strict';
  angular.module('creditCardApp').factory('authFactory', ['$window', function($window) {
    return {
      getToken: function() {
        return $window.localStorage.getItem('authToken') || 'mock-token-12345';
      },
      getUserId: function() {
        return $window.localStorage.getItem('userId') || 'user-001';
      },
      setToken: function(token) {
        $window.localStorage.setItem('authToken', token);
      },
      setUserId: function(userId) {
        $window.localStorage.setItem('userId', userId);
      }
    };
  }]);
})();