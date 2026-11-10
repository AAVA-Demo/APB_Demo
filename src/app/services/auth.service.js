(function() {
  'use strict';
  angular.module('creditCardApp').service('AuthService', ['$http', '$window', '$q', function($http, $window, $q) {
    const TOKEN_KEY = 'authToken';
    const USER_KEY = 'currentUser';
    
    this.validateSession = function() {
      const deferred = $q.defer();
      const token = $window.localStorage.getItem(TOKEN_KEY);
      if (token) {
        $http.get('/api/auth/validate', {
          headers: { 'Authorization': 'Bearer ' + token }
        }).then(function(response) {
          deferred.resolve(true);
        }, function(error) {
          $window.localStorage.removeItem(TOKEN_KEY);
          $window.localStorage.removeItem(USER_KEY);
          deferred.reject(false);
        });
      } else {
        const mockUser = { userId: 'user123', name: 'Demo User' };
        $window.localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        $window.localStorage.setItem(TOKEN_KEY, 'mock-token-' + Date.now());
        deferred.resolve(true);
      }
      return deferred.promise;
    };
    
    this.getToken = function() {
      return $window.localStorage.getItem(TOKEN_KEY);
    };
    
    this.getCurrentUser = function() {
      const user = $window.localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    };
    
    this.logout = function() {
      $window.localStorage.removeItem(TOKEN_KEY);
      $window.localStorage.removeItem(USER_KEY);
    };
  }]);
})();