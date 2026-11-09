(function() {
  'use strict';
  angular.module('app.analytics').service('AnalyticsService', ['$http', '$q', 'TransactionCategorizerFactory', AnalyticsService]);
  function AnalyticsService($http, $q, TransactionCategorizerFactory) {
    var vm = this;
    vm.getTransactionData = getTransactionData;
    vm.getAnalyticsSummary = getAnalyticsSummary;
    function getTransactionData(cardId, months) {
      months = months || 12;
      var url = '/api/transactions?months=' + months;
      if (cardId) {
        url += '&cardId=' + cardId;
      }
      return $http.get(url).then(function(response) {
        var transactions = response.data;
        transactions.forEach(function(txn) {
          if (!txn.category || txn.category === 'Uncategorized') {
            txn.category = TransactionCategorizerFactory.categorize(txn);
          }
        });
        return transactions;
      }).catch(function(error) {
        console.error('Error fetching transaction data:', error);
        return [];
      });
    }
    function getAnalyticsSummary(transactions) {
      var categoryBreakdown = {};
      var monthlyTrends = {};
      transactions.forEach(function(txn) {
        if (!categoryBreakdown[txn.category]) {
          categoryBreakdown[txn.category] = { category: txn.category, totalSpend: 0, transactionCount: 0 };
        }
        categoryBreakdown[txn.category].totalSpend += txn.amount;
        categoryBreakdown[txn.category].transactionCount++;
        var txnDate = new Date(txn.date);
        var monthKey = txnDate.getFullYear() + '-' + (txnDate.getMonth() + 1);
        if (!monthlyTrends[monthKey]) {
          monthlyTrends[monthKey] = { month: monthKey, totalSpend: 0 };
        }
        monthlyTrends[monthKey].totalSpend += txn.amount;
      });
      var categoryArray = Object.keys(categoryBreakdown).map(function(key) {
        return categoryBreakdown[key];
      });
      var monthlyArray = Object.keys(monthlyTrends).map(function(key) {
        return monthlyTrends[key];
      }).sort(function(a, b) {
        return a.month.localeCompare(b.month);
      });
      return {
        categoryBreakdown: categoryArray,
        monthlyTrends: monthlyArray,
        dateRange: {
          start: transactions.length > 0 ? new Date(Math.min.apply(null, transactions.map(function(t) { return new Date(t.date); }))) : null,
          end: transactions.length > 0 ? new Date(Math.max.apply(null, transactions.map(function(t) { return new Date(t.date); }))) : null
        }
      };
    }
  }
})();