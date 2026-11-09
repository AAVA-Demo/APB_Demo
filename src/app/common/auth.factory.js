(function() {
  'use strict';
  angular.module('app.common')
    .factory('AuthFactory', AuthFactory);
  AuthFactory.$inject = ['$window', '$http'];
  function AuthFactory($window, $http) {
    var token = 'mock-auth-token-12345';
    return {
      getToken: function() {
        return token;
      },
      validateSession: function() {
        return !!token;
      },
      injectToken: function(config) {
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
      }
    };
  }
})();