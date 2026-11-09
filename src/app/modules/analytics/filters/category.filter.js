(function() {
  'use strict';
  angular.module('analyticsModule')
    .filter('categoryFilter', function() {
      return function(transactions, category) {
        if (!category) {
          return transactions;
        }
        var filtered = [];
        angular.forEach(transactions, function(txn) {
          if (txn.category === category) {
            filtered.push(txn);
          }
        });
        return filtered;
      };
    });
})();