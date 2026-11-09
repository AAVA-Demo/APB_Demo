(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategoryAPI', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const baseUrl = API_CONFIG.baseUrl;

      return {
        fetchCategories: function(userId) {
          return $http.get(`${baseUrl}${API_CONFIG.endpoints.categories}?userId=${userId}`)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Fetch categories API error:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();