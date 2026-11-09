(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
      var self = this;
      self.login = function(credentials) {
        return $http.post('/api/auth/login', credentials)
          .then(function(response) {
            $window.localStorage.setItem('authToken', response.data.token);
            $window.localStorage.setItem('userId', response.data.userId);
            return response.data;
          });
      };
      self.logout = function() {
        $window.localStorage.removeItem('authToken');
        $window.localStorage.removeItem('userId');
        $window.location.href = '#/login';
      };
      self.getUserId = function() {
        return $window.localStorage.getItem('userId') || 'user123';
      };
      self.isAuthenticated = function() {
        return !!$window.localStorage.getItem('authToken');
      };
    }]);
})();