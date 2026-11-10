(function() {
  'use strict';
  angular.module('cardManagement')
    .service('CardComparisonService', [function() {
      this.calculateUtilization = function(card) {
        if (!card || !card.creditLimit || card.creditLimit === 0) return 0;
        return ((card.creditLimit - card.availableCredit) / card.creditLimit * 100).toFixed(2);
      };
      this.compareCards = function(cards) {
        if (!cards || cards.length === 0) return [];
        return cards.map(function(card) {
          return {
            cardId: card.cardId,
            cardIssuer: card.cardIssuer,
            utilization: this.calculateUtilization(card),
            outstandingBalance: card.outstandingBalance,
            availableCredit: card.availableCredit
          };
        }.bind(this));
      };
    }]);
})();