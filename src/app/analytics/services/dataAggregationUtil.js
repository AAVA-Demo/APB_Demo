(function() {
  'use strict';
  angular.module('ccAnalyticsModule').factory('DataAggregationUtil', ['CategoryService', function(CategoryService) {
    return {
      aggregateByCategory: function(transactions) {
        var categoryMap = {};
        transactions.forEach(function(txn) {
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = 0;
          }
          categoryMap[txn.category] += txn.amount;
        });
        var totalAmount = Object.values(categoryMap).reduce(function(sum, val) { return sum + val; }, 0);
        return Object.keys(categoryMap).map(function(cat) {
          return {
            category: cat,
            amount: categoryMap[cat],
            percentage: totalAmount > 0 ? (categoryMap[cat] / totalAmount * 100).toFixed(2) : 0
          };
        });
      },
      aggregateByMonth: function(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var monthKey = new Date(txn.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = 0;
          }
          monthMap[monthKey] += txn.amount;
        });
        return Object.keys(monthMap).map(function(month) {
          return { month: month, totalSpend: monthMap[month] };
        });
      },
      aggregateByCard: function(transactions, cards) {
        var cardMap = {};
        transactions.forEach(function(txn) {
          if (!cardMap[txn.cardId]) {
            cardMap[txn.cardId] = 0;
          }
          cardMap[txn.cardId] += txn.amount;
        });
        return Object.keys(cardMap).map(function(cardId) {
          var card = cards.find(function(c) { return c.id === cardId; });
          return {
            cardId: cardId,
            cardName: card ? card.cardName : 'Unknown',
            totalSpend: cardMap[cardId]
          };
        });
      }
    };
  }]);
})();