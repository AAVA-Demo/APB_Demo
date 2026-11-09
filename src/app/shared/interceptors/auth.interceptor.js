(function() {
  'use strict';
  angular.module('creditCardApp').factory('AuthInterceptor', ['$q', '$window', '$injector', function($q, $window, $injector) {
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
          $window.location.href = '#!/login';
        }
        return $q.reject(rejection);
      }
    };
  }]);
})();