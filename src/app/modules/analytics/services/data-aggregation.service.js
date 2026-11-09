(function() {
  'use strict';
  angular.module('creditCardApp.analytics').service('DataAggregationService', ['SPENDING_CATEGORIES', function(SPENDING_CATEGORIES) {
    var service = this;
    service.aggregateByMonth = function(transactions) {
      var monthlyMap = {};
      transactions.forEach(function(txn) {
        var month = new Date(txn.transactionDate).toISOString().substring(0, 7);
        if (!monthlyMap[month]) {
          monthlyMap[month] = 0;
        }
        monthlyMap[month] += txn.amount;
      });
      return {
        dimension: 'monthly',
        data: Object.keys(monthlyMap).sort().map(function(month) {
          return { label: month, value: monthlyMap[month] };
        })
      };
    };
    service.aggregateByCard = function(transactions) {
      var cardMap = {};
      transactions.forEach(function(txn) {
        if (!cardMap[txn.cardId]) {
          cardMap[txn.cardId] = 0;
        }
        cardMap[txn.cardId] += txn.amount;
      });
      return {
        dimension: 'card',
        data: Object.keys(cardMap).map(function(cardId) {
          return { label: cardId, value: cardMap[cardId] };
        })
      };
    };
    service.aggregateByCategory = function(transactions) {
      var categoryMap = {};
      SPENDING_CATEGORIES.forEach(function(cat) {
        categoryMap[cat] = 0;
      });
      transactions.forEach(function(txn) {
        if (categoryMap.hasOwnProperty(txn.category)) {
          categoryMap[txn.category] += txn.amount;
        }
      });
      var total = Object.values(categoryMap).reduce(function(sum, val) { return sum + val; }, 0);
      return {
        dimension: 'category',
        data: SPENDING_CATEGORIES.map(function(cat) {
          return {
            label: cat,
            value: categoryMap[cat],
            percentage: total > 0 ? (categoryMap[cat] / total * 100).toFixed(2) : 0
          };
        })
      };
    };
  }]);
  DataAggregationService.$inject = ['SPENDING_CATEGORIES'];
})();