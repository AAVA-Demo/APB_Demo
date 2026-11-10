(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$http', '$q', function($http, $q) {
      var userId = 'current';
      this.getCategorySpending = function() {
        return $http.get('/api/transactions', {
          params: {userId: userId, period: '12months'},
          cache: true
        }).then(function(response) {
          var transactions = response.data || [];
          var categoryBreakdown = {};
          transactions.forEach(function(txn) {
            var category = txn.category || 'Miscellaneous';
            if (!categoryBreakdown[category]) {
              categoryBreakdown[category] = 0;
            }
            categoryBreakdown[category] += txn.amount || 0;
          });
          return categoryBreakdown;
        }).catch(function(error) {
          console.error('Failed to fetch category spending:', error);
          return $q.reject(error);
        });
      };
      this.getMonthlyTrends = function() {
        return $http.get('/api/analytics/trends', {
          params: {userId: userId},
          cache: true
        }).then(function(response) {
          return response.data || [];
        }).catch(function(error) {
          console.error('Failed to fetch monthly trends:', error);
          return $q.reject(error);
        });
      };
    }]);
})();