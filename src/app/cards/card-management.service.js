(function() {
  'use strict';
  angular.module('cardManagementModule').service('CardManagementService', ['CreditCardDataFactory', '$q', function(CreditCardDataFactory, $q) {
    this.getAllCards = function() {
      return CreditCardDataFactory.getAllCards().then(function(cards) {
        const promises = cards.map(function(card) {
          return CreditCardDataFactory.getCardSpendSummary(card.cardId).then(function(spendSummary) {
            card.spendSummary = spendSummary;
            return card;
          }).catch(function() {
            card.spendSummary = null;
            return card;
          });
        });
        return $q.all(promises);
      });
    };
    this.getCardDetails = function(cardId) {
      return $q.all({
        card: CreditCardDataFactory.fetchCardById(cardId),
        spendSummary: CreditCardDataFactory.getCardSpendSummary(cardId)
      });
    };
    this.compareCards = function(cardIds) {
      const promises = cardIds.map(function(cardId) {
        return CreditCardDataFactory.fetchCardById(cardId).then(function(card) {
          return CreditCardDataFactory.getCardSpendSummary(cardId).then(function(spendSummary) {
            card.spendSummary = spendSummary;
            return card;
          }).catch(function() {
            card.spendSummary = null;
            return card;
          });
        });
      });
      return $q.all(promises);
    };
  }]);
})();