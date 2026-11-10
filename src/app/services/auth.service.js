(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$http', '$window', 'AUTH_CONFIG', 'API_CONFIG', AuthService]);
  function AuthService($http, $window, AUTH_CONFIG, API_CONFIG) {
    var self = this;
    self.login = login;
    self.logout = logout;
    self.isAuthenticated = isAuthenticated;
    self.getToken = getToken;
    function login(credentials) {
      return $http.post(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth, credentials)
        .then(function(response) {
          var token = response.data.token;
          $window[AUTH_CONFIG.storageType].setItem(AUTH_CONFIG.tokenKey, token);
          return token;
        });
    }
    function logout() {
      $window[AUTH_CONFIG.storageType].removeItem(AUTH_CONFIG.tokenKey);
    }
    function isAuthenticated() {
      return !!getToken();
    }
    function getToken() {
      return $window[AUTH_CONFIG.storageType].getItem(AUTH_CONFIG.tokenKey);
    }
  }
})();