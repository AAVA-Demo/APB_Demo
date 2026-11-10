(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategoryService', [function() {
      var self = this;
      self.categories = [
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
        return self.categories;
      };
      self.isValidCategory = function(category) {
        return self.categories.indexOf(category) !== -1;
      };
    }]);
})();