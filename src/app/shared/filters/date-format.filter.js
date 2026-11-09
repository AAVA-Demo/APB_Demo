(function() {
  'use strict';
  angular.module('creditCardApp').filter('dateFormat', function() {
    return function(input, format) {
      if (!input) return '';
      var date = new Date(input);
      if (format === 'YYYY-MM') {
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
      }
      return date.toLocaleDateString();
    };
  });
})();