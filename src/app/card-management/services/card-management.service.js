(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardManagementService', ['CardDataFactory', 'AuthService', '$q', function(CardDataFactory, AuthService, $q) {
      const self = this;
      let cardCache = null;
      self.getAllCards = function() {
        if (cardCache) {
          return $q.resolve(cardCache);
        }
        const userId = AuthService.getUserId();
        return CardDataFactory.fetchUserCards(userId)
          .then(function(cards) {
            cardCache = cards;
            return cards;
          });
      };
      self.getCardDetails = function(cardId) {
        return CardDataFactory.fetchCardById(cardId);
      };
      self.clearCache = function() {
        cardCache = null;
      };
    }]);
})();