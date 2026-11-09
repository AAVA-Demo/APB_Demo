(function() {
  'use strict';
  angular.module('app.analytics').service('AnalyticsService', ['TransactionAPIFactory', 'CategoryAPIFactory', 'CreditCardAPIFactory', '$q', function(TransactionAPIFactory, CategoryAPIFactory, CreditCardAPIFactory, $q) {
    var self = this;
    self.getSpendingData = function(userId, dateRange) {
      return $q.all({
        transactions: TransactionAPIFactory.getTransactions(userId, dateRange),
        categories: CategoryAPIFactory.getCategories(),
        cards: CreditCardAPIFactory.getCards(userId)
      }).then(function(results) {
        var transactions = results.transactions;
        var categories = results.categories;
        var cards = results.cards;
        var categoryBreakdown = self.aggregateByCategory(transactions);
        var cardWiseSpend = self.aggregateByCard(transactions, cards);
        var monthlyTrend = self.aggregateByMonth(transactions);
        return {
          userId: userId,
          period: self.formatDate(new Date()),
          categoryBreakdown: categoryBreakdown,
          cardWiseSpend: cardWiseSpend,
          monthlyTrend: monthlyTrend
        };
      });
    };
    self.aggregateByCategory = function(transactions) {
      var categoryMap = {};
      transactions.forEach(function(txn) {
        if (!categoryMap[txn.category]) {
          categoryMap[txn.category] = {category: txn.category, amount: 0, transactionCount: 0};
        }
        categoryMap[txn.category].amount += txn.amount;
        categoryMap[txn.category].transactionCount++;
      });
      return Object.keys(categoryMap).map(function(key) {
        return {
          category: categoryMap[key].category,
          amount: parseFloat(categoryMap[key].amount).toFixed(2),
          transactionCount: categoryMap[key].transactionCount
        };
      });
    };
    self.aggregateByCard = function(transactions, cards) {
      var cardMap = {};
      transactions.forEach(function(txn) {
        if (!cardMap[txn.cardId]) {
          var card = cards.find(function(c) { return c.cardId === txn.cardId; });
          cardMap[txn.cardId] = {
            cardId: txn.cardId,
            cardName: card ? card.cardName : 'Unknown',
            totalSpend: 0,
            categoryBreakdown: {}
          };
        }
        cardMap[txn.cardId].totalSpend += txn.amount;
        if (!cardMap[txn.cardId].categoryBreakdown[txn.category]) {
          cardMap[txn.cardId].categoryBreakdown[txn.category] = {category: txn.category, amount: 0, transactionCount: 0};
        }
        cardMap[txn.cardId].categoryBreakdown[txn.category].amount += txn.amount;
        cardMap[txn.cardId].categoryBreakdown[txn.category].transactionCount++;
      });
      return Object.keys(cardMap).map(function(key) {
        return {
          cardId: cardMap[key].cardId,
          cardName: cardMap[key].cardName,
          totalSpend: parseFloat(cardMap[key].totalSpend).toFixed(2),
          categoryBreakdown: Object.keys(cardMap[key].categoryBreakdown).map(function(cat) {
            return {
              category: cardMap[key].categoryBreakdown[cat].category,
              amount: parseFloat(cardMap[key].categoryBreakdown[cat].amount).toFixed(2),
              transactionCount: cardMap[key].categoryBreakdown[cat].transactionCount
            };
          })
        };
      });
    };
    self.aggregateByMonth = function(transactions) {
      var monthMap = {};
      transactions.forEach(function(txn) {
        var month = self.formatDate(new Date(txn.transactionDate));
        if (!monthMap[month]) {
          monthMap[month] = {month: month, totalSpend: 0, categoryBreakdown: {}};
        }
        monthMap[month].totalSpend += txn.amount;
        if (!monthMap[month].categoryBreakdown[txn.category]) {
          monthMap[month].categoryBreakdown[txn.category] = {category: txn.category, amount: 0, transactionCount: 0};
        }
        monthMap[month].categoryBreakdown[txn.category].amount += txn.amount;
        monthMap[month].categoryBreakdown[txn.category].transactionCount++;
      });
      return Object.keys(monthMap).map(function(key) {
        return {
          month: monthMap[key].month,
          totalSpend: parseFloat(monthMap[key].totalSpend).toFixed(2),
          categoryBreakdown: Object.keys(monthMap[key].categoryBreakdown).map(function(cat) {
            return {
              category: monthMap[key].categoryBreakdown[cat].category,
              amount: parseFloat(monthMap[key].categoryBreakdown[cat].amount).toFixed(2),
              transactionCount: monthMap[key].categoryBreakdown[cat].transactionCount
            };
          })
        };
      });
    };
    self.formatDate = function(date) {
      return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
    };
  }]);
})();