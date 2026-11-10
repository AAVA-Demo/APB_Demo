(function() {
  'use strict';
  angular.module('cardManagement')
    .service('CardManagementService', ['CreditCardDataFactory', 'UserProfileFactory', '$q', function(CreditCardDataFactory, UserProfileFactory, $q) {
      var self = this;
      var cardCache = null;
      self.getUserCards = function(userId) {
        if (cardCache) {
          return $q.resolve(cardCache);
        }
        return UserProfileFactory.getCardsByUserId(userId)
          .then(function(cardIds) {
            var promises = cardIds.map(function(cardId) {
              return CreditCardDataFactory.getCardDetails(cardId);
            });
            return $q.all(promises);
          })
          .then(function(cards) {
            cardCache = cards;
            return cards;
          });
      };
      self.getCardById = function(cardId) {
        if (cardCache) {
          var cached = cardCache.find(function(c) { return c.cardId === cardId; });
          if (cached) return $q.resolve(cached);
        }
        return CreditCardDataFactory.getCardDetails(cardId);
      };
      self.clearCache = function() {
        cardCache = null;
      };
    }]);
})();