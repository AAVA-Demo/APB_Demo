(function() {
  'use strict';
  angular.module('transactionModule').service('TransactionService', ['TransactionDataFactory', 'CreditCardDataFactory', '$q', function(TransactionDataFactory, CreditCardDataFactory, $q) {
    this.getTransactions = function(filters) {
      return TransactionDataFactory.fetchTransactions(filters).then(function(transactions) {
        const promises = transactions.map(function(transaction) {
          return CreditCardDataFactory.fetchCardById(transaction.cardId).then(function(card) {
            transaction.cardDetails = card;
            return transaction;
          }).catch(function() {
            transaction.cardDetails = null;
            return transaction;
          });
        });
        return $q.all(promises);
      });
    };
    this.getTransactionById = function(transactionId) {
      return TransactionDataFactory.getTransactionById(transactionId).then(function(transaction) {
        return CreditCardDataFactory.fetchCardById(transaction.cardId).then(function(card) {
          transaction.cardDetails = card;
          return transaction;
        }).catch(function() {
          transaction.cardDetails = null;
          return transaction;
        });
      });
    };
  }]);
})();