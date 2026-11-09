(function() {
  'use strict';
  angular.module('app.transactions')
    .service('TransactionService', ['$q', 'CreditCardFactory', 'TransactionDataFactory', function($q, CreditCardFactory, TransactionDataFactory) {
      this.getTransactions = function() {
        return CreditCardFactory.fetchCreditCards()
          .then(function(cards) {
            var cardIds = cards.map(function(c) { return c.cardId; });
            return TransactionDataFactory.fetchTransactions(cardIds);
          })
          .then(function(transactions) {
            transactions.sort(function(a, b) {
              return new Date(b.transactionDate) - new Date(a.transactionDate);
            });
            return {
              transactions: transactions,
              totalCount: transactions.length
            };
          });
      };
    }]);
})();