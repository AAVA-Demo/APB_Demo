(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('AnalyticsService', ['TransactionCategorizationService', 'DataAnalyticsService', '$http', '$q', '$cacheFactory', 'LocalStorageService', function(TransactionCategorizationService, DataAnalyticsService, $http, $q, $cacheFactory, LocalStorageService) {
      var cache = $cacheFactory('analyticsCache');
      var CACHE_DURATION = 300000;
      this.getSpendingAnalytics = function(timeRange) {
        var deferred = $q.defer();
        var cacheKey = 'analytics_' + timeRange.startDate.getTime() + '_' + timeRange.endDate.getTime();
        var cachedData = cache.get(cacheKey);
        if (cachedData && (new Date().getTime() - cachedData.timestamp < CACHE_DURATION)) {
          deferred.resolve(cachedData.data);
          return deferred.promise;
        }
        var userId = LocalStorageService.get('userId') || 'user123';
        var mockTransactions = this.generateMockTransactions(timeRange);
        setTimeout(function() {
          var categorizedTransactions = TransactionCategorizationService.categorizeTransactions(mockTransactions);
          var analyticsData = DataAnalyticsService.calculateTrends(categorizedTransactions, timeRange);
          cache.put(cacheKey, { data: analyticsData, timestamp: new Date().getTime() });
          deferred.resolve(analyticsData);
        }, 1000);
        return deferred.promise;
      };
      this.generateMockTransactions = function(timeRange) {
        var transactions = [];
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var startDate = new Date(timeRange.startDate);
        var endDate = new Date(timeRange.endDate);
        var monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        for (var i = 0; i <= monthsDiff; i++) {
          var monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
          categories.forEach(function(category) {
            var txnCount = Math.floor(Math.random() * 5) + 2;
            for (var j = 0; j < txnCount; j++) {
              var day = Math.floor(Math.random() * 28) + 1;
              var txnDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
              if (txnDate <= endDate) {
                transactions.push({
                  transactionId: 'txn_' + i + '_' + category + '_' + j,
                  amount: Math.floor(Math.random() * 5000) + 500,
                  category: category,
                  merchantName: 'Merchant ' + category,
                  transactionDate: txnDate.toISOString(),
                  description: category + ' purchase'
                });
              }
            }
          });
        }
        return transactions;
      };
    }]);
})();