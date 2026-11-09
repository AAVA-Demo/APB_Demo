(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsAPI', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      const baseUrl = API_CONFIG.baseUrl;

      return {
        fetchTrends: function(userId, timeRange) {
          const params = {
            userId: userId,
            startDate: timeRange.startDate.toISOString(),
            endDate: timeRange.endDate.toISOString()
          };
          return $http.get(`${baseUrl}${API_CONFIG.endpoints.analyticsTrends}`, {params: params})
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              console.error('Fetch trends API error:', error);
              return $q.reject(error);
            });
        }
      };
    }]);
})();