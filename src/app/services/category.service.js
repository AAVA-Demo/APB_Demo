(function() {
  'use strict';
  angular.module('creditCardApp').service('CategoryService', ['$q', function($q) {
    var self = this;
    var categories = [
      'Food & Dining',
      'Fuel',
      'Shopping',
      'Travel',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Miscellaneous'
    ];
    self.getCategories = function() {
      return categories;
    };
    self.categorize = function(transactions) {
      return transactions.map(function(txn) {
        if (!txn.category || categories.indexOf(txn.category) === -1) {
          txn.category = 'Miscellaneous';
        }
        return txn;
      });
    };
  }]);
})();