(function() {
  'use strict';
  angular.module('ccTransactionModule').service('TransactionService', ['$q', 'ApiService', 'Transaction', function($q, ApiService, Transaction) {
    var self = this;
    var cache = null;
    self.getTransactions = function(filter) {
      var deferred = $q.defer();
      var params = {};
      if (filter) {
        if (filter.cardId) params.cardId = filter.cardId;
        if (filter.category) params.category = filter.category;
        if (filter.page) params.page = filter.page;
        if (filter.pageSize) params.pageSize = filter.pageSize;
      }
      ApiService.get('/api/transactions', params).then(function(response) {
        var transactions = response.data.map(function(txnData) {
          return new Transaction(txnData);
        });
        if (filter && filter.searchTerm) {
          transactions = transactions.filter(function(txn) {
            return txn.merchant.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                   txn.description.toLowerCase().includes(filter.searchTerm.toLowerCase());
          });
        }
        cache = transactions;
        deferred.resolve(transactions);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    self.invalidateCache = function() {
      cache = null;
    };
  }]);
})();