(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', 'API_BASE_URL', function($http, $window, $q, API_BASE_URL) {
      this.validateSession = function() {
        var token = $window.sessionStorage.getItem('authToken');
        if (!token) {
          $window.sessionStorage.setItem('authToken', 'mock-token-12345');
          return $q.resolve({ valid: true, userId: 'U001' });
        }
        return $q.resolve({ valid: true, userId: 'U001' });
      };
      this.getUserId = function() {
        return 'U001';
      };
    }]);
})();