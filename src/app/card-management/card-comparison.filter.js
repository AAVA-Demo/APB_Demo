(function() {
  'use strict';
  angular.module('creditCard.management')
    .filter('cardComparison', [function() {
      return function(cards, sortBy, reverse) {
        if (!cards || !sortBy) return cards;
        var sorted = cards.slice().sort(function(a, b) {
          var aVal = a[sortBy] || 0;
          var bVal = b[sortBy] || 0;
          return aVal - bVal;
        });
        return reverse ? sorted.reverse() : sorted;
      };
    }]);
})();