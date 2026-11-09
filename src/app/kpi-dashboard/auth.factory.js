(function() {
  'use strict';
  angular.module('kpiDashboardModule')
    .factory('AuthFactory', ['$window', '$http', function($window, $http) {
      var token = $window.sessionStorage.getItem('authToken') || 'mock-jwt-token';
      return {
        authenticate: function() {
          if (!token) {
            token = 'mock-jwt-token';
            $window.sessionStorage.setItem('authToken', token);
          }
          return token;
        },
        getToken: function() {
          return token;
        }
      };
    }]);
})();