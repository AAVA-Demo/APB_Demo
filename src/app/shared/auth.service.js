(function() {
  'use strict';
  angular.module('app.shared')
    .factory('AuthService', ['$window', function($window) {
      var service = {
        getToken: getToken,
        setToken: setToken,
        isAuthenticated: isAuthenticated
      };
      return service;
      function getToken() {
        return $window.sessionStorage.getItem('authToken') || 'mock-token-12345';
      }
      function setToken(token) {
        $window.sessionStorage.setItem('authToken', token);
      }
      function isAuthenticated() {
        return !!getToken();
      }
    }]);
})();