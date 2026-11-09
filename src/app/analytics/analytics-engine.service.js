(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsEngineService', function() {
    this.aggregateByCategory = function(transactions) {
      const grouped = _.groupBy(transactions, 'category');
      const totalAmount = transactions.reduce(function(sum, txn) { return sum + txn.amount; }, 0);
      return Object.keys(grouped).map(function(category) {
        const categoryTotal = _.sumBy(grouped[category], 'amount');
        return {
          category: category,
          totalAmount: categoryTotal,
          transactionCount: grouped[category].length,
          percentage: totalAmount > 0 ? (categoryTotal / totalAmount * 100) : 0
        };
      });
    };
    this.aggregateByMonth = function(transactions) {
      const grouped = _.groupBy(transactions, function(txn) {
        const date = new Date(txn.transactionDate);
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      });
      return Object.keys(grouped).sort().map(function(month) {
        return {
          month: month,
          totalSpend: _.sumBy(grouped[month], 'amount')
        };
      });
    };
  });
})();