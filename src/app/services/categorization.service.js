(function() {
  'use strict';
  angular.module('creditCardApp').service('CategorizationService', [function() {
    var SPENDING_CATEGORIES = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel',
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    this.validateCategory = function(category) {
      return SPENDING_CATEGORIES.indexOf(category) !== -1 ? category : 'Miscellaneous';
    };
    this.getCategories = function() {
      return SPENDING_CATEGORIES;
    };
  }]);
})();