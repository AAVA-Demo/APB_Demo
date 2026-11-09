(function() {
  'use strict';
  angular.module('creditCardApp.analytics').service('AnalyticsService', ['TransactionDataService', 'DataAggregationService', '$q', function(TransactionDataService, DataAggregationService, $q) {
    var service = this;
    service.getAnalyticsData = function(userId, dateRange) {
      return TransactionDataService.getHistoricalTransactions(userId, dateRange).then(function(transactions) {
        var monthlyTrends = DataAggregationService.aggregateByMonth(transactions);
        var cardWiseSpend = DataAggregationService.aggregateByCard(transactions);
        var categoryWiseSpend = DataAggregationService.aggregateByCategory(transactions);
        return {
          userId: userId,
          dateRange: dateRange,
          monthlyTrends: monthlyTrends,
          cardWiseSpend: cardWiseSpend,
          categoryWiseSpend: categoryWiseSpend,
          totalTransactions: transactions.length,
          lastUpdated: new Date()
        };
      }).catch(function(error) {
        console.error('Error fetching analytics data:', error);
        throw error;
      });
    };
  }]);
  AnalyticsService.$inject = ['TransactionDataService', 'DataAggregationService', '$q'];
})();