(function() {
  'use strict';
  angular.module('creditCardApp').factory('AnalyticsAggregationService', [function() {
    return {
      aggregateByCategory: function(transactions) {
        var categoryMap = {};
        transactions.forEach(function(txn) {
          var cat = txn.category || 'Miscellaneous';
          if (!categoryMap[cat]) {
            categoryMap[cat] = { category: cat, totalAmount: 0, transactionCount: 0 };
          }
          categoryMap[cat].totalAmount += txn.amount || 0;
          categoryMap[cat].transactionCount += 1;
        });
        var total = Object.keys(categoryMap).reduce(function(sum, key) {
          return sum + categoryMap[key].totalAmount;
        }, 0);
        return Object.keys(categoryMap).map(function(key) {
          var item = categoryMap[key];
          item.percentage = total > 0 ? (item.totalAmount / total * 100).toFixed(2) : 0;
          return item;
        });
      },
      aggregateByCard: function(transactions) {
        var cardMap = {};
        transactions.forEach(function(txn) {
          var cardId = txn.cardId || 'Unknown';
          if (!cardMap[cardId]) {
            cardMap[cardId] = { cardId: cardId, totalAmount: 0, transactionCount: 0 };
          }
          cardMap[cardId].totalAmount += txn.amount || 0;
          cardMap[cardId].transactionCount += 1;
        });
        return Object.keys(cardMap).map(function(key) { return cardMap[key]; });
      },
      aggregateByMonth: function(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var date = new Date(txn.transactionDate);
          var monthKey = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = { month: monthKey, totalSpend: 0 };
          }
          monthMap[monthKey].totalSpend += txn.amount || 0;
        });
        return Object.keys(monthMap).sort().map(function(key) { return monthMap[key]; });
      }
    };
  }]);
})();