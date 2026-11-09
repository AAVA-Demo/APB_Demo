(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardManagementService', ['CreditCardFactory', 'TransactionFactory', '$q', function(CreditCardFactory, TransactionFactory, $q) {
      var cardCache = null;
      var service = {
        getAllCards: getAllCards,
        getCardSpend: getCardSpend
      };
      return service;
      function getAllCards() {
        if (cardCache) {
          return $q.resolve(cardCache);
        }
        return CreditCardFactory.getAllCards()
          .then(function(cards) {
            cardCache = cards;
            return cards;
          });
      }
      function getCardSpend(cardId) {
        var promises = {
          cards: getAllCards(),
          transactions: TransactionFactory.getCardTransactions(cardId)
        };
        return $q.all(promises)
          .then(function(results) {
            var card = results.cards.find(function(c) { return c.cardId === cardId; });
            var transactions = results.transactions;
            if (!card) {
              return $q.reject('Card not found');
            }
            var totalSpend = 0;
            var categoryMap = {};
            transactions.forEach(function(txn) {
              totalSpend += txn.amount || 0;
              var category = txn.category || 'Miscellaneous';
              if (!categoryMap[category]) {
                categoryMap[category] = { amount: 0, count: 0 };
              }
              categoryMap[category].amount += txn.amount || 0;
              categoryMap[category].count++;
            });
            var categoryBreakdown = [];
            for (var cat in categoryMap) {
              categoryBreakdown.push({
                categoryName: cat,
                amount: categoryMap[cat].amount,
                percentage: totalSpend > 0 ? ((categoryMap[cat].amount / totalSpend) * 100).toFixed(2) : 0,
                transactionCount: categoryMap[cat].count
              });
            }
            return {
              card: card,
              spendSummary: {
                cardId: cardId,
                totalSpend: totalSpend,
                transactionCount: transactions.length,
                categoryBreakdown: categoryBreakdown
              }
            };
          });
      }
    }]);
})();