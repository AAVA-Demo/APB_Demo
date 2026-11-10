(function() {
  'use strict';
  angular.module('creditCardApp').factory('authInterceptor', authInterceptor);
  authInterceptor.$inject = ['$q', '$injector'];
  function authInterceptor($q, $injector) {
    return {
      request: function(config) {
        var AuthService = $injector.get('AuthService');
        var token = AuthService.getToken();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          var AuthService = $injector.get('AuthService');
          AuthService.logout();
          $injector.get('$state').go('login');
        }
        return $q.reject(rejection);
      }
    };
  }
})();