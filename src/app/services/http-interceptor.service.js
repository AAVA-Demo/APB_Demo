(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('HttpInterceptorService', ['$q', '$window', 'AuthService', function($q, $window, AuthService) {
      return {
        request: function(config) {
          if (config.url.indexOf('/api/') !== -1) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + AuthService.getToken();
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            AuthService.clearToken();
            $window.location.href = '#!/login';
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();