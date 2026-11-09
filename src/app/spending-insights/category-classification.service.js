(function() {
  'use strict';
  angular.module('spendingInsightsModule')
    .factory('CategoryClassificationService', function() {
      var categoryMap = {
        'FOOD': 'Food & Dining',
        'FUEL': 'Fuel',
        'SHOP': 'Shopping',
        'TRVL': 'Travel',
        'ENT': 'Entertainment',
        'UTIL': 'Utilities',
        'HLTH': 'Healthcare',
        'EDU': 'Education',
        'MISC': 'Miscellaneous'
      };
      return {
        classify: function(transaction) {
          return categoryMap[transaction.merchantCode] || 'Miscellaneous';
        }
      };
    });
})();