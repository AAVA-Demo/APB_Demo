(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('categoryName', categoryName);
  function categoryName() {
    var categoryMap = {
      'FOOD': 'Food & Dining',
      'FUEL': 'Fuel',
      'SHOPPING': 'Shopping',
      'TRAVEL': 'Travel',
      'ENTERTAINMENT': 'Entertainment',
      'UTILITIES': 'Utilities',
      'HEALTHCARE': 'Healthcare',
      'EDUCATION': 'Education',
      'MISCELLANEOUS': 'Miscellaneous'
    };
    return function(input) {
      if (!input) return input;
      var upperInput = input.toUpperCase();
      return categoryMap[upperInput] || input;
    };
  }
})();