(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsEngine', [function() {
      return {
        aggregate: function(transactions, categories) {
          var monthlyTrends = {};
          var cardWiseSpend = {};
          var categoryWiseSpend = {};
          categories.forEach(function(cat) {
            categoryWiseSpend[cat] = 0;
          });
          transactions.forEach(function(txn) {
            var month = new Date(txn.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short' });
            monthlyTrends[month] = (monthlyTrends[month] || 0) + txn.amount;
            cardWiseSpend[txn.cardId] = (cardWiseSpend[txn.cardId] || 0) + txn.amount;
            if (txn.category && categoryWiseSpend.hasOwnProperty(txn.category)) {
              categoryWiseSpend[txn.category] += txn.amount;
            } else {
              categoryWiseSpend['Miscellaneous'] = (categoryWiseSpend['Miscellaneous'] || 0) + txn.amount;
            }
          });
          var monthlyTrendsArray = Object.keys(monthlyTrends).map(function(month) {
            return { month: month, amount: monthlyTrends[month] };
          });
          var cardWiseSpendArray = Object.keys(cardWiseSpend).map(function(cardId) {
            return { cardId: cardId, amount: cardWiseSpend[cardId] };
          });
          var categoryWiseSpendArray = Object.keys(categoryWiseSpend).map(function(category) {
            return { category: category, amount: categoryWiseSpend[category] };
          });
          return {
            monthlyTrends: monthlyTrendsArray,
            cardWiseSpend: cardWiseSpendArray,
            categoryWiseSpend: categoryWiseSpendArray
          };
        }
      };
    }]);
})();