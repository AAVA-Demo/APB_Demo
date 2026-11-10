(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPIFactory', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      return {
        getConsolidatedMetrics: function(userId) {
          return $http.get(API_CONFIG.baseUrl + '/dashboard/metrics', {
            params: { userId: userId },
            timeout: API_CONFIG.timeout
          })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching consolidated metrics:', error);
            return {};
          });
        }
      };
    }]);
})();