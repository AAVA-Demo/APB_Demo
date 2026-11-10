(function() {
  'use strict';
  angular.module('analytics')
    .service('CategoryFilterService', [function() {
      var CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      this.getCategories = function() {
        return CATEGORIES;
      };
      this.filterByCategory = function(transactions, category) {
        if (!category || category === 'All') return transactions;
        return transactions.filter(function(txn) {
          return txn.category === category;
        });
      };
      this.filterByDateRange = function(transactions, startDate, endDate) {
        var start = new Date(startDate);
        var end = new Date(endDate);
        return transactions.filter(function(txn) {
          var txnDate = new Date(txn.date);
          return txnDate >= start && txnDate <= end;
        });
      };
    }]);
})();