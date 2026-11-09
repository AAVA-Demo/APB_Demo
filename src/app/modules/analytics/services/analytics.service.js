(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('analyticsService', AnalyticsService);
  AnalyticsService.$inject = ['transactionDataService', 'categoryClassificationService', '$q'];
  function AnalyticsService(transactionDataService, categoryClassificationService, $q) {
    var service = this;
    var cachedTransactions = [];
    service.loadCategoryAnalytics = function(userId) {
      var deferred = $q.defer();
      transactionDataService.getTransactions(userId).then(function(transactions) {
        cachedTransactions = transactions;
        var categorizedTransactions = categoryClassificationService.categorizeTransactions(transactions);
        var categoryBreakdown = service.aggregateByCategory(categorizedTransactions);
        var totalSpend = 0;
        angular.forEach(categoryBreakdown, function(cat) {
          totalSpend += cat.totalSpend;
        });
        deferred.resolve({
          userId: userId,
          categoryBreakdown: categoryBreakdown,
          totalSpend: totalSpend,
          lastUpdated: new Date()
        });
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    service.aggregateByCategory = function(transactions) {
      var categories = {};
      angular.forEach(transactions, function(txn) {
        var cat = txn.category || 'Miscellaneous';
        if (!categories[cat]) {
          categories[cat] = {category: cat, totalSpend: 0, transactionCount: 0, percentage: 0};
        }
        categories[cat].totalSpend += txn.amount;
        categories[cat].transactionCount += 1;
      });
      var result = [];
      var total = 0;
      angular.forEach(categories, function(val) {
        total += val.totalSpend;
        result.push(val);
      });
      angular.forEach(result, function(cat) {
        cat.percentage = total > 0 ? (cat.totalSpend / total * 100).toFixed(2) : 0;
      });
      return result;
    };
    service.getTransactionsByCategory = function(category) {
      var filtered = cachedTransactions.filter(function(txn) {
        return txn.category === category;
      });
      return $q.resolve(filtered);
    };
  }
})();