(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthAPI', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const baseUrl = API_CONFIG.baseUrl;

      return {
        validateSession: function() {
          return $http.get(`${baseUrl}${API_CONFIG.endpoints.authValidate}`)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Auth validation error:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();