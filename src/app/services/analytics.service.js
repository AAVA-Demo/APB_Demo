(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      this.getSpendingAnalytics = function(dateRange) {
        var params = {
          from: dateRange.from,
          to: dateRange.to
        };
        return $http.get(API_ENDPOINTS.analytics, { params: params }).then(function(response) {
          return response.data;
        }, function(error) {
          return $q.reject(error);
        });
      };
      this.getCategoryBreakdown = function(dateRange) {
        return this.getSpendingAnalytics(dateRange).then(function(data) {
          return data.categoryBreakdown;
        });
      };
      this.getMonthlyTrends = function(dateRange) {
        return this.getSpendingAnalytics(dateRange).then(function(data) {
          return data.monthlyTrends;
        });
      };
    }]);
})();