(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['TransactionDataFactory', '$http', '$q', AnalyticsService]);
  function AnalyticsService(TransactionDataFactory, $http, $q) {
    var service = this;
    var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    service.getSpendingAnalytics = function(userId, dateRange) {
      var deferred = $q.defer();
      TransactionDataFactory.fetchTransactions(userId, dateRange)
        .then(function(transactions) {
          var analytics = service.aggregateData(userId, dateRange, transactions);
          deferred.resolve(analytics);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };
    service.aggregateData = function(userId, dateRange, transactions) {
      var categoryBreakdown = {};
      var monthlyTrends = {};
      var cardWiseAnalytics = {};
      categories.forEach(function(cat) {
        categoryBreakdown[cat] = { category: cat, amount: 0, transactionCount: 0, percentage: 0 };
      });
      var totalSpend = 0;
      transactions.forEach(function(txn) {
        var cat = txn.category || 'Miscellaneous';
        var amount = txn.amount || 0;
        totalSpend += amount;
        if (categoryBreakdown[cat]) {
          categoryBreakdown[cat].amount += amount;
          categoryBreakdown[cat].transactionCount++;
        } else {
          if (!categoryBreakdown['Miscellaneous']) {
            categoryBreakdown['Miscellaneous'] = { category: 'Miscellaneous', amount: 0, transactionCount: 0, percentage: 0 };
          }
          categoryBreakdown['Miscellaneous'].amount += amount;
          categoryBreakdown['Miscellaneous'].transactionCount++;
        }
        var monthKey = txn.transactionDate ? new Date(txn.transactionDate).toISOString().substring(0, 7) : 'Unknown';
        if (!monthlyTrends[monthKey]) {
          monthlyTrends[monthKey] = { month: monthKey, totalSpend: 0, categoryWiseSpend: {} };
        }
        monthlyTrends[monthKey].totalSpend += amount;
        monthlyTrends[monthKey].categoryWiseSpend[cat] = (monthlyTrends[monthKey].categoryWiseSpend[cat] || 0) + amount;
        var cardId = txn.cardId || 'Unknown';
        if (!cardWiseAnalytics[cardId]) {
          cardWiseAnalytics[cardId] = {
            cardId: cardId,
            cardLastFour: txn.cardLastFour || 'XXXX',
            totalSpend: 0,
            categoryBreakdown: {}
          };
        }
        cardWiseAnalytics[cardId].totalSpend += amount;
        cardWiseAnalytics[cardId].categoryBreakdown[cat] = (cardWiseAnalytics[cardId].categoryBreakdown[cat] || 0) + amount;
      });
      for (var cat in categoryBreakdown) {
        categoryBreakdown[cat].percentage = totalSpend > 0 ? (categoryBreakdown[cat].amount / totalSpend * 100).toFixed(2) : 0;
      }
      return {
        userId: userId,
        dateRange: dateRange,
        categoryBreakdown: Object.values(categoryBreakdown),
        monthlyTrends: Object.values(monthlyTrends),
        cardWiseAnalytics: Object.values(cardWiseAnalytics)
      };
    };
  }
})();