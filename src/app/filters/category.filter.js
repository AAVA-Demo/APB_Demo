(function() {
  'use strict';
  angular.module('app.analytics')
    .filter('categoryFilter', [function() {
      return function(transactions, selectedCategory) {
        if (!selectedCategory) return transactions;
        return transactions.filter(function(t) {
          return t.category === selectedCategory.name;
        });
      };
    }]);
})();