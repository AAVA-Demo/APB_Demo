(function() {
  'use strict';
  angular.module('cardManagementModule')
    .filter('cardStatusFilter', [function() {
      return function(cards, status) {
        if (!status || status === 'all') return cards;
        return cards.filter(function(card) {
          return card.status === status;
        });
      };
    }]);
})();