(function() {
  'use strict';
  angular.module('cardManagement')
    .factory('AuthFactory', ['$http', '$window', '$q', function($http, $window, $q) {
      return {
        getToken: function() {
          return $window.localStorage.getItem('authToken') || 'mock-token-123';
        },
        validateSession: function() {
          return $q.resolve(true);
        }
      };
    }]);
})();