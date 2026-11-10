(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('TransactionProcessingService', ['TransactionDataFactory', '$filter', function(TransactionDataFactory, $filter) {
      this.getCurrentMonthSpend = function() {
        return TransactionDataFactory.fetchTransactions('current')
          .then(function(transactions) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const filtered = transactions.filter(function(t) {
              const txDate = new Date(t.transactionDate);
              return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            });
            return filtered.reduce(function(sum, t) { return sum + t.amount; }, 0);
          });
      };
    }]);
})();