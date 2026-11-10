(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthFactory', ['$window', function($window) {
      return {
        getAuthToken: function() {
          return $window.localStorage.getItem('authToken') || 'demo-token-12345';
        },
        setAuthToken: function(token) {
          $window.localStorage.setItem('authToken', token);
        }
      };
    }]);
})();