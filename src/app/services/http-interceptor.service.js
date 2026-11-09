(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('HttpInterceptorService', ['$q', '$injector', 'LocalStorageService', function($q, $injector, LocalStorageService) {
      return {
        request: function(config) {
          var token = LocalStorageService.get('authToken');
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            var AuthFactory = $injector.get('AuthFactory');
            AuthFactory.logout();
            var $location = $injector.get('$location');
            $location.path('/login');
          }
          if (rejection.status >= 400) {
            toastr.error(rejection.data && rejection.data.message || 'An error occurred', 'Error');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();