(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategoryService', ['$q', function($q) {
      var categories = [
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
        getCategoryMetadata: function() {
          return $q.resolve(categories);
        },
        getAllCategories: function() {
          return categories;
        }
      };
    }]);
})();