(function() {
  'use strict';
  angular.module('analyticsModule').service('SpendingAnalyticsService', ['$http', '$q', 'API_CONFIG', '$filter', function($http, $q, API_CONFIG, $filter) {
    this.getSpendingAnalytics = function(request) {
      var params = {
        userId: request.userId,
        start: $filter('date')(request.startDate, 'yyyy-MM-dd'),
        end: $filter('date')(request.endDate, 'yyyy-MM-dd')
      };
      if (request.cardIds && request.cardIds.length > 0) {
        params.cardIds = request.cardIds.join(',');
      }
      return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS, {
        params: params,
        timeout: API_CONFIG.TIMEOUT
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();