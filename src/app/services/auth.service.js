(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
      this.validateSession = function() {
        var token = $window.sessionStorage.getItem('authToken');
        if (!token) {
          return $q.reject('No token found');
        }
        return $http.get('/api/auth/validate').then(function(response) {
          return response.data;
        });
      };
      this.isAuthenticated = function() {
        return !!$window.sessionStorage.getItem('authToken');
      };
      this.redirectToLogin = function() {
        $window.location.href = '/login';
      };
      this.setToken = function(token) {
        $window.sessionStorage.setItem('authToken', token);
      };
      this.clearToken = function() {
        $window.sessionStorage.removeItem('authToken');
      };
    }]);
})();