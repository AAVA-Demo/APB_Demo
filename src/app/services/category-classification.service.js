(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategoryClassificationService', [CategoryClassificationService]);
  function CategoryClassificationService() {
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
    var service = {
      getCategories: getCategories,
      classifyTransaction: classifyTransaction
    };
    return service;
    function getCategories() {
      return categories;
    }
    function classifyTransaction(transaction) {
      if (transaction.category && categories.indexOf(transaction.category) !== -1) {
        return transaction.category;
      }
      return 'Miscellaneous';
    }
  }
})();