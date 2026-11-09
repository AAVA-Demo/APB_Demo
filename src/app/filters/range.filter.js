(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('range', [rangeFilter]);

  function rangeFilter() {
    return function(input, start, end) {
      var result = [];
      for (var i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    };
  }
})();