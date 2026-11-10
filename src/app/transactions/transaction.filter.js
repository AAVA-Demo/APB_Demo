(function() {
  'use strict';
  angular.module('app.transactions')
    .filter('transactionFilter', [function() {
      return function(transactions, searchTerm, cardId) {
        if (!transactions) return [];
        var filtered = transactions;
        if (searchTerm) {
          var term = searchTerm.toLowerCase();
          filtered = filtered.filter(function(t) {
            return (t.merchant && t.merchant.toLowerCase().indexOf(term) !== -1) ||
                   (t.description && t.description.toLowerCase().indexOf(term) !== -1) ||
                   (t.category && t.category.toLowerCase().indexOf(term) !== -1);
          });
        }
        if (cardId) {
          filtered = filtered.filter(function(t) {
            return t.cardId === cardId;
          });
        }
        return filtered;
      };
    }]);
})();