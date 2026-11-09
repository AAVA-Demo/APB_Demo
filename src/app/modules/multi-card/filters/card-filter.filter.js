(function() {
  'use strict';
  angular.module('multiCardManagement').filter('cardFilter', [function() {
    return function(cards, filterText) {
      if (!filterText) return cards;
      const lower = filterText.toLowerCase();
      return cards.filter(card => {
        return (card.cardNumber && card.cardNumber.toLowerCase().includes(lower)) ||
               (card.cardType && card.cardType.toLowerCase().includes(lower)) ||
               (card.issuer && card.issuer.toLowerCase().includes(lower)) ||
               (card.status && card.status.toLowerCase().includes(lower));
      });
    };
  }]);
})();