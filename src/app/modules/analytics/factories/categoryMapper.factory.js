(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .factory('CategoryMapperFactory', [CategoryMapperFactory]);
  function CategoryMapperFactory() {
    var validCategories = [
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
    return {
      mapCategory: function(category) {
        if (validCategories.indexOf(category) !== -1) {
          return category;
        }
        return 'Miscellaneous';
      },
      getValidCategories: function() {
        return validCategories.slice();
      }
    };
  }
})();