(function() {
  'use strict';
  angular.module('creditCardApp').service('CategorizationService', [function() {
    const validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    this.categorize = function(transactions) {
      return transactions.map(t => {
        if (!t.category || validCategories.indexOf(t.category) === -1) {
          t.category = 'Miscellaneous';
        }
        return t;
      });
    };
  }]);
})();