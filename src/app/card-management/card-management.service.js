(function() {
  'use strict';
  angular.module('creditCardManagementModule').service('CardManagementService', ['CardDataFactory', 'TransactionService', '$q', function(CardDataFactory, TransactionService, $q) {
    var self = this;
    self.getAllCards = function() {
      return CardDataFactory.fetchCards().then(function(cards) {
        var promises = cards.map(function(card) {
          return TransactionService.getCardSpending(card.cardId).then(function(spending) {
            card.monthlySpend = spending.monthlySpend || 0;
            card.utilization = card.creditLimit > 0 ? ((card.currentBalance / card.creditLimit) * 100).toFixed(2) : 0;
            return card;
          }).catch(function() {
            card.monthlySpend = 0;
            card.utilization = 0;
            return card;
          });
        });
        return $q.all(promises);
      });
    };
    self.getCardById = function(cardId) {
      return CardDataFactory.fetchCards().then(function(cards) {
        var card = cards.find(function(c) { return c.cardId === cardId; });
        if (card) {
          card.utilization = card.creditLimit > 0 ? ((card.currentBalance / card.creditLimit) * 100).toFixed(2) : 0;
          return card;
        }
        return $q.reject('Card not found');
      });
    };
  }]);
})();