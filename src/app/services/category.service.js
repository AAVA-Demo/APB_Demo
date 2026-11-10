(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategoryService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      const self = this;
      const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      self.categorizeTransactions = function(transactions) {
        return transactions.map(function(txn) {
          if (!txn.category) {
            txn.category = categories[Math.floor(Math.random() * categories.length)];
          }
          return txn;
        });
      };
      self.getCategories = function() {
        return categories;
      };
    }]);
})();