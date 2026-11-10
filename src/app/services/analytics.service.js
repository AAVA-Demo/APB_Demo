(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsService', ['TransactionFactory', 'CategoryFactory', '$q', function(TransactionFactory, CategoryFactory, $q) {
      var vm = this;
      vm.getSpendingInsights = function(startDate, endDate) {
        var promises = {
          transactions: TransactionFactory.getTransactions(startDate, endDate),
          categories: CategoryFactory.getCategories()
        };
        return $q.all(promises).then(function(results) {
          var transactions = results.transactions || [];
          var categories = results.categories || [];
          var monthlyTrends = vm.aggregateByMonth(transactions);
          var categorySpends = vm.aggregateByCategory(transactions, categories);
          var cardWiseSpends = vm.aggregateByCard(transactions, categories);
          return {
            monthlyTrends: monthlyTrends,
            categorySpends: categorySpends,
            cardWiseSpends: cardWiseSpends
          };
        });
      };
      vm.aggregateByMonth = function(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var date = new Date(txn.date);
          var monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = 0;
          }
          monthMap[monthKey] += txn.amount;
        });
        return Object.keys(monthMap).map(function(month) {
          return { month: month, totalSpend: monthMap[month] };
        });
      };
      vm.aggregateByCategory = function(transactions, categories) {
        var categoryMap = {};
        var totalSpend = 0;
        transactions.forEach(function(txn) {
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = { totalSpend: 0, transactionCount: 0 };
          }
          categoryMap[txn.category].totalSpend += txn.amount;
          categoryMap[txn.category].transactionCount += 1;
          totalSpend += txn.amount;
        });
        return Object.keys(categoryMap).map(function(cat) {
          return {
            category: cat,
            totalSpend: categoryMap[cat].totalSpend,
            transactionCount: categoryMap[cat].transactionCount,
            percentage: totalSpend > 0 ? (categoryMap[cat].totalSpend / totalSpend * 100).toFixed(2) : 0
          };
        });
      };
      vm.aggregateByCard = function(transactions, categories) {
        var cardMap = {};
        transactions.forEach(function(txn) {
          if (!cardMap[txn.cardId]) {
            cardMap[txn.cardId] = { cardId: txn.cardId, cardName: 'Card ' + txn.cardId.substr(-4), totalSpend: 0, categoryBreakdown: {} };
          }
          cardMap[txn.cardId].totalSpend += txn.amount;
          if (!cardMap[txn.cardId].categoryBreakdown[txn.category]) {
            cardMap[txn.cardId].categoryBreakdown[txn.category] = { category: txn.category, totalSpend: 0, transactionCount: 0 };
          }
          cardMap[txn.cardId].categoryBreakdown[txn.category].totalSpend += txn.amount;
          cardMap[txn.cardId].categoryBreakdown[txn.category].transactionCount += 1;
        });
        return Object.keys(cardMap).map(function(cardId) {
          var card = cardMap[cardId];
          card.categoryBreakdown = Object.keys(card.categoryBreakdown).map(function(cat) {
            return card.categoryBreakdown[cat];
          });
          return card;
        });
      };
    }]);
})();