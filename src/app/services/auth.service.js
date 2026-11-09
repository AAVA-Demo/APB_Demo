(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
    const API_BASE = '/api';
    this.login = function(credentials) {
      return $http.post(`${API_BASE}/auth/login`, credentials).then(function(response) {
        if (response.data.token) {
          $window.localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
      });
    };
    this.logout = function() {
      $window.localStorage.removeItem('authToken');
    };
    this.validateSession = function() {
      const token = $window.localStorage.getItem('authToken');
      return !!token;
    };
    this.getToken = function() {
      return $window.localStorage.getItem('authToken');
    };
  }]);
})();