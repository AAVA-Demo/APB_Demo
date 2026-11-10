(function() {
  'use strict';
  angular.module('creditCardApp').service('CategoryClassificationService', ['$http', '$q', function($http, $q) {
    var CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    this.ensureCategorization = function(transactions) {
      return $q.resolve(transactions.map(function(txn) {
        if (!txn.category || CATEGORIES.indexOf(txn.category) === -1) {
          txn.category = 'Miscellaneous';
        }
        return txn;
      }));
    };
    this.getCategories = function() {
      return CATEGORIES;
    };
  }]);
})();