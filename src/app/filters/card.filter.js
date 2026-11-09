(function() {
  'use strict';
  angular.module('app.cardManagement')
    .filter('cardFilter', [function() {
      return function(cards, searchText) {
        if (!searchText) {
          return cards;
        }
        var filtered = [];
        var lowerSearch = searchText.toLowerCase();
        cards.forEach(function(card) {
          var cardName = (card.cardName || '').toLowerCase();
          var last4 = (card.last4Digits || '').toLowerCase();
          if (cardName.indexOf(lowerSearch) !== -1 || last4.indexOf(lowerSearch) !== -1) {
            filtered.push(card);
          }
        });
        return filtered;
      };
    }]);
})();