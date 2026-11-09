(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsService', ['TransactionDataService', 'CategoryClassificationService', '$q', AnalyticsService]);
  function AnalyticsService(TransactionDataService, CategoryClassificationService, $q) {
    var service = {
      getSpendingInsights: getSpendingInsights
    };
    return service;
    function getSpendingInsights() {
      return TransactionDataService.getTransactions()
        .then(function(transactions) {
          var categoryBreakdown = calculateCategoryBreakdown(transactions);
          var monthlyTrends = calculateMonthlyTrends(transactions);
          var cardWiseSpend = calculateCardWiseSpend(transactions);
          return {
            categoryBreakdown: categoryBreakdown,
            monthlyTrends: monthlyTrends,
            cardWiseSpend: cardWiseSpend
          };
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
    function calculateCategoryBreakdown(transactions) {
      var categories = {};
      var total = 0;
      transactions.forEach(function(txn) {
        var category = txn.category || 'Miscellaneous';
        if (!categories[category]) {
          categories[category] = 0;
        }
        categories[category] += txn.amount;
        total += txn.amount;
      });
      var breakdown = [];
      for (var cat in categories) {
        breakdown.push({
          category: cat,
          amount: categories[cat],
          percentage: total > 0 ? (categories[cat] / total * 100).toFixed(2) : 0
        });
      }
      return breakdown;
    }
    function calculateMonthlyTrends(transactions) {
      var months = {};
      transactions.forEach(function(txn) {
        var date = new Date(txn.date);
        var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (!months[monthKey]) {
          months[monthKey] = 0;
        }
        months[monthKey] += txn.amount;
      });
      var trends = [];
      for (var month in months) {
        trends.push({
          month: month,
          totalSpend: months[month]
        });
      }
      trends.sort(function(a, b) {
        return a.month.localeCompare(b.month);
      });
      return trends;
    }
    function calculateCardWiseSpend(transactions) {
      var cards = {};
      transactions.forEach(function(txn) {
        var cardId = txn.cardId;
        if (!cards[cardId]) {
          cards[cardId] = {
            cardId: cardId,
            cardName: txn.cardName || 'Unknown',
            totalSpend: 0
          };
        }
        cards[cardId].totalSpend += txn.amount;
      });
      var cardSpend = [];
      for (var cardId in cards) {
        cardSpend.push(cards[cardId]);
      }
      return cardSpend;
    }
  }
})();