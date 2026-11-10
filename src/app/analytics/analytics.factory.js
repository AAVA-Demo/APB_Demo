(function() {
  'use strict';
  angular.module('creditCard.analytics').factory('AnalyticsFactory', ['CategoryService', function(CategoryService) {
    var factory = {};
    factory.aggregateByCategory = function(transactions) {
      var categoryMap = {};
      var total = 0;
      transactions.forEach(function(txn) {
        var cat = txn.category || 'Miscellaneous';
        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, totalAmount: 0, transactionCount: 0 };
        }
        categoryMap[cat].totalAmount += txn.amount;
        categoryMap[cat].transactionCount++;
        total += txn.amount;
      });
      var result = Object.keys(categoryMap).map(function(key) {
        var item = categoryMap[key];
        item.percentage = total > 0 ? ((item.totalAmount / total) * 100).toFixed(2) : 0;
        return item;
      });
      return result.sort(function(a, b) { return b.totalAmount - a.totalAmount; });
    };
    factory.aggregateByMonth = function(transactions) {
      var monthMap = {};
      transactions.forEach(function(txn) {
        var date = new Date(txn.date);
        var monthKey = date.getFullYear() + '-' + (date.getMonth() + 1);
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { month: monthKey, totalSpend: 0 };
        }
        monthMap[monthKey].totalSpend += txn.amount;
      });
      return Object.keys(monthMap).map(function(key) {
        return monthMap[key];
      }).sort(function(a, b) {
        return a.month.localeCompare(b.month);
      });
    };
    factory.aggregateByCard = function(transactions) {
      var cardMap = {};
      transactions.forEach(function(txn) {
        var cardName = txn.cardName || 'Unknown';
        if (!cardMap[cardName]) {
          cardMap[cardName] = { cardName: cardName, totalSpend: 0 };
        }
        cardMap[cardName].totalSpend += txn.amount;
      });
      return Object.keys(cardMap).map(function(key) {
        return cardMap[key];
      }).sort(function(a, b) { return b.totalSpend - a.totalSpend; });
    };
    return factory;
  }]);
})();