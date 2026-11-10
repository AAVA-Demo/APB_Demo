(function() {
  'use strict';
  angular.module('analytics')
    .factory('DataAggregationFactory', ['CategoryFactory', function(CategoryFactory) {
      return {
        aggregateData: function(transactions) {
          const monthlyMap = {};
          const cardMap = {};
          const categoryMap = {};
          transactions.forEach(function(txn) {
            const month = txn.timestamp.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyMap[month] = (monthlyMap[month] || 0) + txn.amount;
            const cardName = txn.cardId;
            cardMap[cardName] = (cardMap[cardName] || 0) + txn.amount;
            const category = CategoryFactory.categorizeTransaction(txn);
            categoryMap[category] = (categoryMap[category] || 0) + txn.amount;
          });
          const monthlyTrends = Object.keys(monthlyMap).map(m => ({ month: m, totalSpend: monthlyMap[m] }));
          const cardWiseSpending = Object.keys(cardMap).map(c => ({ cardId: c, cardName: c, totalSpend: cardMap[c] }));
          const totalCategorySpend = Object.values(categoryMap).reduce((sum, amt) => sum + amt, 0);
          const categoryWiseSpending = Object.keys(categoryMap).map(c => ({
            category: c,
            amount: categoryMap[c],
            percentage: (categoryMap[c] / totalCategorySpend * 100).toFixed(2)
          }));
          return {
            monthlyTrends: monthlyTrends,
            cardWiseSpending: cardWiseSpending,
            categoryWiseSpending: categoryWiseSpending,
            currentMonthTotal: monthlyTrends.length > 0 ? monthlyTrends[monthlyTrends.length - 1].totalSpend : 0,
            previousMonthTotal: monthlyTrends.length > 1 ? monthlyTrends[monthlyTrends.length - 2].totalSpend : 0
          };
        }
      };
    }]);
})();