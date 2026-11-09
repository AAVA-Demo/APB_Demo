(function() {
  'use strict';
  angular.module('app.analytics').filter('categoryName', categoryName);
  function categoryName() {
    var categoryMap = {
      'FD': 'Food & Dining',
      'FUEL': 'Fuel',
      'SHOP': 'Shopping',
      'TRAVEL': 'Travel',
      'ENT': 'Entertainment',
      'UTIL': 'Utilities',
      'HEALTH': 'Healthcare',
      'EDU': 'Education',
      'MISC': 'Miscellaneous'
    };
    return function(input) {
      return categoryMap[input] || input;
    };
  }
})();