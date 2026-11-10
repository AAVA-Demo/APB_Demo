(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('AnalyticsService', ['TransactionDataFactory', 'TransactionCategorizationService', '$cacheFactory', function(TransactionDataFactory, TransactionCategorizationService, $cacheFactory) {
      const cache = $cacheFactory('analyticsCache');
      this.getCategorySpending = function() {
        const cachedData = cache.get('categorySpending');
        if (cachedData) {
          return Promise.resolve(cachedData);
        }
        return TransactionDataFactory.fetchTransactions()
          .then(function(transactions) {
            const categoryMap = {};
            transactions.forEach(function(t) {
              const category = TransactionCategorizationService.categorize(t);
              if (!categoryMap[category]) {
                categoryMap[category] = { category: category, totalAmount: 0, transactionCount: 0 };
              }
              categoryMap[category].totalAmount += t.amount;
              categoryMap[category].transactionCount++;
            });
            const totalSpend = Object.values(categoryMap).reduce(function(sum, c) { return sum + c.totalAmount; }, 0);
            const result = Object.values(categoryMap).map(function(c) {
              c.percentage = totalSpend > 0 ? (c.totalAmount / totalSpend * 100).toFixed(2) : 0;
              return c;
            });
            cache.put('categorySpending', result);
            return result;
          });
      };
    }]);
})();