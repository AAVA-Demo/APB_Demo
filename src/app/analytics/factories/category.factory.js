(function() {
  'use strict';
  angular.module('analytics')
    .factory('CategoryFactory', [function() {
      const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      return {
        categorizeTransaction: function(txn) {
          return txn.category || 'Miscellaneous';
        },
        getCategories: function() {
          return categories;
        }
      };
    }]);
})();