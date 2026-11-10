(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AggregationService', [function() {
      this.aggregateData = function(transactions) {
        var categorySpends = {};
        var monthlyTrends = {};
        var cardSpends = {};
        transactions.forEach(function(txn) {
          var category = txn.category || 'Miscellaneous';
          if (!categorySpends[category]) {
            categorySpends[category] = {category: category, totalAmount: 0, transactionCount: 0, percentage: 0};
          }
          categorySpends[category].totalAmount += txn.amount;
          categorySpends[category].transactionCount++;
          var date = new Date(txn.date);
          var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
          if (!monthlyTrends[monthKey]) {
            monthlyTrends[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
          }
          monthlyTrends[monthKey].totalSpend += txn.amount;
          if (!monthlyTrends[monthKey].categoryBreakdown[category]) {
            monthlyTrends[monthKey].categoryBreakdown[category] = 0;
          }
          monthlyTrends[monthKey].categoryBreakdown[category] += txn.amount;
          var cardId = txn.cardId;
          if (!cardSpends[cardId]) {
            cardSpends[cardId] = {cardId: cardId, cardName: txn.cardName, totalSpend: 0, categoryBreakdown: {}};
          }
          cardSpends[cardId].totalSpend += txn.amount;
          if (!cardSpends[cardId].categoryBreakdown[category]) {
            cardSpends[cardId].categoryBreakdown[category] = 0;
          }
          cardSpends[cardId].categoryBreakdown[category] += txn.amount;
        });
        var totalSpend = Object.values(categorySpends).reduce(function(sum, cat) { return sum + cat.totalAmount; }, 0);
        Object.values(categorySpends).forEach(function(cat) {
          cat.percentage = totalSpend > 0 ? (cat.totalAmount / totalSpend * 100).toFixed(2) : 0;
        });
        return {
          categorySpends: Object.values(categorySpends),
          monthlyTrends: Object.values(monthlyTrends).sort(function(a, b) { return a.month.localeCompare(b.month); }),
          cardSpends: Object.values(cardSpends)
        };
      };
    }]);
})();