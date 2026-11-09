(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('CardService', ['$q', '$cacheFactory', 'CreditCardApiService', function($q, $cacheFactory, CreditCardApiService) {
      var cardCache = $cacheFactory('cardCache');
      this.getAllCards = function(userId) {
        var cacheKey = 'cards_' + userId;
        var cached = cardCache.get(cacheKey);
        if (cached) {
          return $q.resolve(cached);
        }
        return CreditCardApiService.fetchAllCards(userId).then(function(cards) {
          cardCache.put(cacheKey, cards);
          return cards;
        });
      };
      this.getCardById = function(cardId) {
        var allCardsCache = cardCache.get('cards_user123');
        if (allCardsCache) {
          var card = allCardsCache.find(function(c) { return c.cardId === cardId; });
          if (card) {
            return $q.resolve(card);
          }
        }
        return CreditCardApiService.fetchAllCards('user123').then(function(cards) {
          cardCache.put('cards_user123', cards);
          var card = cards.find(function(c) { return c.cardId === cardId; });
          return card || $q.reject('Card not found');
        });
      };
      this.clearCache = function() {
        cardCache.removeAll();
      };
    }]);
})();