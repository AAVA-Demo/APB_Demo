(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', AuthService);
  AuthService.$inject = ['$http', '$window'];
  function AuthService($http, $window) {
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    vm.getToken = getToken;
    vm.isAuthenticated = isAuthenticated;
    function login() {
      var token = 'mock-jwt-token-' + Date.now();
      $window.sessionStorage.setItem('authToken', token);
      return token;
    }
    function logout() {
      $window.sessionStorage.removeItem('authToken');
    }
    function getToken() {
      return $window.sessionStorage.getItem('authToken');
    }
    function isAuthenticated() {
      return !!getToken();
    }
  }
})();