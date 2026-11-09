(function() {
  'use strict';
  angular.module('app.transactions').service('TransactionService', ['TransactionAPIFactory', 'CreditCardAPIFactory', '$q', function(TransactionAPIFactory, CreditCardAPIFactory, $q) {
    var self = this;
    var allTransactions = [];
    var pageSize = 50;
    self.loadTransactions = function(userId, filter) {
      return TransactionAPIFactory.getTransactions(userId, filter).then(function(transactions) {
        allTransactions = transactions;
        return self.paginate(allTransactions, 1, pageSize);
      });
    };
    self.filterTransactions = function(filter) {
      var filtered = allTransactions.filter(function(txn) {
        if (filter.cardId && txn.cardId !== filter.cardId) return false;
        if (filter.startDate && new Date(txn.transactionDate) < new Date(filter.startDate)) return false;
        if (filter.endDate && new Date(txn.transactionDate) > new Date(filter.endDate)) return false;
        if (filter.minAmount && txn.amount < filter.minAmount) return false;
        if (filter.maxAmount && txn.amount > filter.maxAmount) return false;
        if (filter.category && txn.category !== filter.category) return false;
        if (filter.searchText) {
          var searchLower = filter.searchText.toLowerCase();
          if (!txn.merchantName.toLowerCase().includes(searchLower) && !txn.description.toLowerCase().includes(searchLower)) {
            return false;
          }
        }
        return true;
      });
      return $q.resolve(self.paginate(filtered, 1, pageSize));
    };
    self.paginate = function(data, page, size) {
      var start = (page - 1) * size;
      var end = start + size;
      return {
        transactions: data.slice(start, end),
        totalCount: data.length,
        currentPage: page,
        pageSize: size,
        totalPages: Math.ceil(data.length / size)
      };
    };
  }]);
})();