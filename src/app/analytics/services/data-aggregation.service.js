(function() {
  'use strict';
  angular.module('app.analytics').service('DataAggregationService', ['TransactionDataFactory', 'TransactionCategorizationService', '$q', function(TransactionDataFactory, TransactionCategorizationService, $q) {
    this.aggregateTransactions = function(filters) {
      return TransactionDataFactory.getTransactions(filters.dateRange).then(function(transactions) {
        var categorized = TransactionCategorizationService.categorizeTransactions(transactions);
        var categoryTotals = {};
        var cardTotals = {};
        var monthlyTotals = {};
        var grandTotal = 0;
        categorized.forEach(function(txn) {
          var cat = txn.merchantCategory;
          var card = txn.cardId;
          var monthKey = txn.transactionDate.getFullYear() + '-' + (txn.transactionDate.getMonth() + 1);
          if (!categoryTotals[cat]) categoryTotals[cat] = {categoryName: cat, totalAmount: 0, transactionCount: 0};
          categoryTotals[cat].totalAmount += txn.amount;
          categoryTotals[cat].transactionCount++;
          if (!cardTotals[card]) cardTotals[card] = {cardId: card, cardName: txn.cardName, totalSpend: 0, categoryBreakdown: {}};
          cardTotals[card].totalSpend += txn.amount;
          if (!cardTotals[card].categoryBreakdown[cat]) cardTotals[card].categoryBreakdown[cat] = {categoryName: cat, totalAmount: 0, transactionCount: 0};
          cardTotals[card].categoryBreakdown[cat].totalAmount += txn.amount;
          cardTotals[card].categoryBreakdown[cat].transactionCount++;
          if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
          monthlyTotals[monthKey].totalSpend += txn.amount;
          if (!monthlyTotals[monthKey].categoryBreakdown[cat]) monthlyTotals[monthKey].categoryBreakdown[cat] = {categoryName: cat, totalAmount: 0};
          monthlyTotals[monthKey].categoryBreakdown[cat].totalAmount += txn.amount;
          grandTotal += txn.amount;
        });
        var categoryArray = Object.keys(categoryTotals).map(function(key) {
          var cat = categoryTotals[key];
          cat.percentage = grandTotal > 0 ? ((cat.totalAmount / grandTotal) * 100).toFixed(2) : 0;
          return cat;
        });
        var cardArray = Object.keys(cardTotals).map(function(key) {
          var card = cardTotals[key];
          card.categoryBreakdown = Object.keys(card.categoryBreakdown).map(function(catKey) {
            return card.categoryBreakdown[catKey];
          });
          return card;
        });
        var monthlyArray = Object.keys(monthlyTotals).map(function(key) {
          var month = monthlyTotals[key];
          month.categoryBreakdown = Object.keys(month.categoryBreakdown).map(function(catKey) {
            return month.categoryBreakdown[catKey];
          });
          return month;
        }).sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
        return {
          categories: categoryArray,
          cards: cardArray,
          monthlyTrends: monthlyArray
        };
      });
    };
  }]);
})();