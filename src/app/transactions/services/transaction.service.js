(function() {
  'use strict';
  angular.module('transactionModule').service('TransactionService', ['$q', 'TransactionDataService', 'CreditCardFactory', function($q, TransactionDataService, CreditCardFactory) {
    this.getTransactions = function(filter) {
      const deferred = $q.defer();
      TransactionDataService.fetchTransactions(filter).then(function(transactions) {
        const enrichedTransactions = transactions.map(function(txn) {
          const card = CreditCardFactory.getCardById(txn.cardId);
          txn.cardDetails = card;
          return txn;
        });
        deferred.resolve(enrichedTransactions);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();