(function() {
  'use strict';
  angular.module('app.analytics')
    .filter('categoryFilter', [function() {
      return function(transactions, category) {
        if (!category) return transactions;
        return transactions.filter(function(txn) {
          return txn.category === category;
        });
      };
    }]);
})();