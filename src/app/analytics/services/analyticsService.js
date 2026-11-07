(function() {
  'use strict';
  angular.module('ccAnalyticsModule').service('AnalyticsService', ['$q', 'ApiService', 'SpendingAnalytics', function($q, ApiService, SpendingAnalytics) {
    var self = this;
    self.getSpendingAnalytics = function(dateRange) {
      var deferred = $q.defer();
      var params = {};
      if (dateRange) {
        params.from = dateRange.from;
        params.to = dateRange.to;
      }
      ApiService.get('/api/analytics/spending', params).then(function(response) {
        var analytics = new SpendingAnalytics(response.data);
        deferred.resolve(analytics);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    self.getTransactionsByCategory = function(category) {
      return ApiService.get('/api/transactions', { category: category });
    };
  }]);
})();