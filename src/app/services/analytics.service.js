(function() {
  'use strict';
  angular.module('creditCardApp').service('AnalyticsService', ['$q', 'TransactionService', 'CategorizationService', 'SpendingSummary', function($q, TransactionService, CategorizationService, SpendingSummary) {
    this.getCategoryWiseSpending = function() {
      return TransactionService.getTransactions().then(function(transactions) {
        var categoryMap = {};
        transactions.forEach(function(txn) {
          var cat = CategorizationService.validateCategory(txn.category);
          if (!categoryMap[cat]) {
            categoryMap[cat] = {categoryName: cat, totalAmount: 0, transactionCount: 0};
          }
          categoryMap[cat].totalAmount += txn.amount;
          categoryMap[cat].transactionCount++;
        });
        var total = Object.values(categoryMap).reduce(function(sum, cat) { return sum + cat.totalAmount; }, 0);
        return Object.values(categoryMap).map(function(cat) {
          cat.percentage = total > 0 ? (cat.totalAmount / total * 100).toFixed(2) : 0;
          return new SpendingSummary(cat);
        });
      });
    };
    this.getMonthlyTrends = function() {
      return TransactionService.getTransactions().then(function(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var monthKey = txn.date.getFullYear() + '-' + String(txn.date.getMonth() + 1).padStart(2, '0');
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {month: monthKey, totalSpend: 0, categories: {}};
          }
          monthMap[monthKey].totalSpend += txn.amount;
          var cat = CategorizationService.validateCategory(txn.category);
          if (!monthMap[monthKey].categories[cat]) {
            monthMap[monthKey].categories[cat] = {categoryName: cat, totalAmount: 0, transactionCount: 0};
          }
          monthMap[monthKey].categories[cat].totalAmount += txn.amount;
          monthMap[monthKey].categories[cat].transactionCount++;
        });
        return Object.keys(monthMap).sort().map(function(key) {
          var month = monthMap[key];
          month.categories = Object.values(month.categories).map(function(cat) {
            return new SpendingSummary(cat);
          });
          return month;
        });
      });
    };
    this.getCardWiseSpending = function() {
      return TransactionService.getTransactions().then(function(transactions) {
        var cardMap = {};
        transactions.forEach(function(txn) {
          if (!cardMap[txn.cardId]) {
            cardMap[txn.cardId] = {cardId: txn.cardId, cardName: 'Card ' + txn.cardId, totalSpend: 0, categories: {}};
          }
          cardMap[txn.cardId].totalSpend += txn.amount;
          var cat = CategorizationService.validateCategory(txn.category);
          if (!cardMap[txn.cardId].categories[cat]) {
            cardMap[txn.cardId].categories[cat] = {categoryName: cat, totalAmount: 0, transactionCount: 0};
          }
          cardMap[txn.cardId].categories[cat].totalAmount += txn.amount;
          cardMap[txn.cardId].categories[cat].transactionCount++;
        });
        return Object.values(cardMap).map(function(card) {
          card.categories = Object.values(card.categories).map(function(cat) {
            return new SpendingSummary(cat);
          });
          return card;
        });
      });
    };
  }]);
})();