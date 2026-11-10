(function() {
  'use strict';
  angular.module('analyticsModule').service('CategoryService', [function() {
    const self = this;
    const CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    self.getCategories = function() {
      return CATEGORIES;
    };
    self.validateCategory = function(category) {
      return CATEGORIES.indexOf(category) !== -1;
    };
  }]);
})();