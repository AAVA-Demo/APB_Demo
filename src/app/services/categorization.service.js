(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategorizationService', ['CategoryModel', function(CategoryModel) {
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      this.categorizeTransactions = function(transactions) {
        var categorized = {};
        angular.forEach(categories, function(cat) {
          categorized[cat] = [];
        });
        angular.forEach(transactions, function(tx) {
          var cat = tx.category || 'Miscellaneous';
          if (categorized[cat]) {
            categorized[cat].push(tx);
          } else {
            categorized['Miscellaneous'].push(tx);
          }
        });
        return categorized;
      };
      this.getCategories = function() {
        return categories;
      };
    }]);
})();