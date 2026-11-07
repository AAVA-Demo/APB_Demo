(function() {
  'use strict';
  angular.module('app.transactions').service('TransactionService', ['TransactionDataFactory', '$q', function(TransactionDataFactory, $q) {
    var cache = {};
    this.getTransactions = function(page, pageSize, filters) {
      return TransactionDataFactory.fetchTransactions(page, pageSize, filters).then(function(response) {
        response.transactions.forEach(function(txn) {
          cache[txn.transactionId] = txn;
        });
        return response;
      });
    };
    this.getTransactionById = function(transactionId) {
      if (cache[transactionId]) {
        return $q.resolve(cache[transactionId]);
      }
      return TransactionDataFactory.getTransactionById(transactionId).then(function(txn) {
        if (txn) cache[transactionId] = txn;
        return txn;
      });
    };
  }]);
})();