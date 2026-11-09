(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$http', 'ApiService', '$q', function($http, ApiService, $q) {
      this.getSpendingData = function(filters) {
        var params = '';
        if (filters && filters.startDate && filters.endDate) {
          params = '?start=' + filters.startDate.toISOString() + '&end=' + filters.endDate.toISOString();
        }
        return ApiService.get('/analytics/spending' + params).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Failed to fetch spending data:', error);
          return $q.reject(error);
        });
      };
    }]);
  AnalyticsService.$inject = ['$http', 'ApiService', '$q'];
})();