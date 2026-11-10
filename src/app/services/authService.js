(function() {
  'use strict';
  angular.module('creditCardApp').service('authService', ['$http', '$window', '$q', function($http, $window, $q) {
    var self = this;
    self.login = function(credentials) {
      return $http.post('/api/auth/login', credentials).then(function(response) {
        $window.sessionStorage.setItem('authToken', response.data.token);
        return response.data;
      });
    };
    self.logout = function() {
      $window.sessionStorage.removeItem('authToken');
    };
    self.getToken = function() {
      return $window.sessionStorage.getItem('authToken');
    };
    self.isAuthenticated = function() {
      return !!self.getToken();
    };
    self.validateSession = function() {
      var deferred = $q.defer();
      if (self.isAuthenticated()) {
        deferred.resolve(true);
      } else {
        deferred.reject('Not authenticated');
      }
      return deferred.promise;
    };
  }]);
})();