(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .factory('TransactionCategorizer', ['CategoryService', function(CategoryService) {
      return {
        categorizeTransactions: function(transactions) {
          return transactions.map(function(txn) {
            if (!txn.category || !CategoryService.isValidCategory(txn.category)) {
              txn.category = 'Miscellaneous';
            }
            return txn;
          });
        }
      };
    }]);
})();