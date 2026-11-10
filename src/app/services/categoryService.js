(function() {
  'use strict';
  angular.module('creditCardApp').service('categoryService', [function() {
    var self = this;
    var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    self.getCategories = function() {
      return validCategories;
    };
    self.validateCategory = function(category) {
      return validCategories.indexOf(category) !== -1 ? category : 'Miscellaneous';
    };
    self.getCategoryColor = function(category) {
      var colorMap = {
        'Food & Dining': '#e74c3c',
        'Fuel': '#f39c12',
        'Shopping': '#9b59b6',
        'Travel': '#3498db',
        'Entertainment': '#1abc9c',
        'Utilities': '#34495e',
        'Healthcare': '#e67e22',
        'Education': '#2ecc71',
        'Miscellaneous': '#95a5a6'
      };
      return colorMap[category] || '#95a5a6';
    };
  }]);
})();