(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', 'API_CONFIG', function($http, $window, API_CONFIG) {
      var self = this;
      self.login = function(credentials) {
        return $http.post(API_CONFIG.BASE_URL + '/api/auth/login', credentials)
          .then(function(response) {
            $window.localStorage.setItem('authToken', response.data.token);
            return response.data;
          });
      };
      self.logout = function() {
        $window.localStorage.removeItem('authToken');
      };
      self.isAuthenticated = function() {
        return !!$window.localStorage.getItem('authToken');
      };
    }]);
})();