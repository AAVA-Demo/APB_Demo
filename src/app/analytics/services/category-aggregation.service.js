(function() {
  'use strict';
  angular.module('app.analytics').service('CategoryAggregationService', [function() {
    var CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    this.aggregateByCategory = function(transactions) {
      var monthlyTrends = {};
      var categoryBreakdown = {};
      var cardWiseSpend = {};
      CATEGORIES.forEach(function(cat) {
        categoryBreakdown[cat] = 0;
      });
      transactions.forEach(function(txn) {
        var month = txn.date.substring(0, 7);
        if (!monthlyTrends[month]) {
          monthlyTrends[month] = 0;
        }
        monthlyTrends[month] += txn.amount;
        if (categoryBreakdown.hasOwnProperty(txn.category)) {
          categoryBreakdown[txn.category] += txn.amount;
        } else {
          categoryBreakdown['Miscellaneous'] += txn.amount;
        }
        if (!cardWiseSpend[txn.cardId]) {
          cardWiseSpend[txn.cardId] = 0;
        }
        cardWiseSpend[txn.cardId] += txn.amount;
      });
      var monthlyTrendsArray = Object.keys(monthlyTrends).sort().map(function(month) {
        return { month: month, totalSpend: monthlyTrends[month] };
      });
      var totalSpend = Object.values(categoryBreakdown).reduce(function(a, b) { return a + b; }, 0);
      var categoryBreakdownArray = Object.keys(categoryBreakdown).map(function(cat) {
        return {
          category: cat,
          totalSpend: categoryBreakdown[cat],
          percentage: totalSpend > 0 ? (categoryBreakdown[cat] / totalSpend * 100).toFixed(2) : 0
        };
      });
      var cardWiseSpendArray = Object.keys(cardWiseSpend).map(function(cardId) {
        return { cardId: cardId, totalSpend: cardWiseSpend[cardId] };
      });
      return {
        monthlyTrends: monthlyTrendsArray,
        categoryBreakdown: categoryBreakdownArray,
        cardWiseSpend: cardWiseSpendArray
      };
    };
  }]);
})();