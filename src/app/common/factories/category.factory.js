(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategoryFactory', ['$q', function($q) {
      var mockCategories = [
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
      var cache = null;
      return {
        getCategories: function() {
          if (cache) {
            return $q.resolve(cache);
          }
          cache = mockCategories;
          return $q.resolve(mockCategories);
        }
      };
    }]);
})();