(function() {
  'use strict';
  angular.module('app.analytics')
    .filter('categoryFilter', function() {
      var categoryIcons = {
        'Food & Dining': 'fa-cutlery',
        'Fuel': 'fa-car',
        'Shopping': 'fa-shopping-cart',
        'Travel': 'fa-plane',
        'Entertainment': 'fa-film',
        'Utilities': 'fa-bolt',
        'Healthcare': 'fa-medkit',
        'Education': 'fa-graduation-cap',
        'Miscellaneous': 'fa-ellipsis-h'
      };
      return function(category) {
        return categoryIcons[category] || 'fa-question';
      };
    });
})();