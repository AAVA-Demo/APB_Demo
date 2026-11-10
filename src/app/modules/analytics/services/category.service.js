(function() {
  'use strict';
  angular.module('app.analytics')
    .service('CategoryService', function() {
      var self = this;

      self.getCategories = function() {
        return [
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
      };
    });
})();