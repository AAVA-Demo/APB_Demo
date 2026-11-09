(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('UserAuthService', ['$http', '$window', 'API_CONFIG', UserAuthService]);
  function UserAuthService($http, $window, API_CONFIG) {
    var vm = this;
    var currentUser = {
      userId: 'user123',
      token: 'mock-jwt-token',
      name: 'John Doe'
    };
    vm.getUserId = function() {
      return currentUser.userId;
    };
    vm.getToken = function() {
      return currentUser.token;
    };
    vm.getCurrentUser = function() {
      return currentUser;
    };
    vm.isAuthenticated = function() {
      return !!currentUser.token;
    };
  }
})();