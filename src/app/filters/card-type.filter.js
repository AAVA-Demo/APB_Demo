(function() {
  'use strict';
  angular.module('app.cardManagement')
    .filter('cardTypeFilter', [function() {
      return function(cards, cardType) {
        if (!cardType || cardType === '') {
          return cards;
        }
        return cards.filter(function(card) {
          return card.cardType === cardType;
        });
      };
    }]);
})();