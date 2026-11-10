(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$q', 'TransactionDataFactory', 'CategorizationService', 'AggregationService', function($q, TransactionDataFactory, CategorizationService, AggregationService) {
      var self = this;
      var cachedData = null;
      self.getSpendingInsights = function() {
        var deferred = $q.defer();
        if (cachedData) {
          deferred.resolve(cachedData);
          return deferred.promise;
        }
        TransactionDataFactory.getTransactions(12).then(function(transactions) {
          var categorized = CategorizationService.categorize(transactions);
          var categorySpending = AggregationService.calculateCategoryTotals(categorized);
          var monthlyTrends = AggregationService.calculateMonthlyTrends(categorized);
          var result = {
            categorySpending: categorySpending,
            monthlyTrends: monthlyTrends,
            selectedPeriod: '12 months',
            filters: {}
          };
          cachedData = result;
          deferred.resolve(result);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      self.applyFilter = function(categorizedData, filter) {
        var filtered = categorizedData;
        if (filter.category) {
          filtered = filtered.filter(function(txn) { return txn.category === filter.category; });
        }
        if (filter.dateRange) {
          filtered = filtered.filter(function(txn) {
            var txnDate = new Date(txn.date);
            return txnDate >= filter.dateRange.start && txnDate <= filter.dateRange.end;
          });
        }
        return {
          categorySpending: AggregationService.calculateCategoryTotals(filtered),
          monthlyTrends: AggregationService.calculateMonthlyTrends(filtered)
        };
      };
    }]);
})();