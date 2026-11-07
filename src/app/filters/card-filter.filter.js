(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('cardFilter', [function() {
      return function(cards, searchText) {
        if (!searchText) return cards;
        var filtered = [];
        var lowerSearch = searchText.toLowerCase();
        angular.forEach(cards, function(card) {
          if ((card.cardName && card.cardName.toLowerCase().indexOf(lowerSearch) !== -1) ||
              (card.cardType && card.cardType.toLowerCase().indexOf(lowerSearch) !== -1) ||
              (card.lastFourDigits && card.lastFourDigits.indexOf(searchText) !== -1)) {
            filtered.push(card);
          }
        });
        return filtered;
      };
    }]);
})();