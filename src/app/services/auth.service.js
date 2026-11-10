(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$http', '$q', function($http, $q) {
    const self = this;
    self.getToken = function() {
      return 'mock-sso-token-12345';
    };
    self.isAuthenticated = function() {
      return true;
    };
  }]);
})();