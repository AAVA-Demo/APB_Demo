(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardComparisonService', ['CreditCardDataService', 'TransactionService', '$q', function(CreditCardDataService, TransactionService, $q) {
      this.compareCards = function(cardIds) {
        return CreditCardDataService.getAllCards('U001').then(function(cards) {
          var selectedCards = cards.filter(function(c) { return cardIds.indexOf(c.cardId) !== -1; });
          return selectedCards.map(function(c) {
            return {
              cardId: c.cardId,
              cardName: c.cardType + ' ' + c.maskedNumber.slice(-4),
              utilizationRate: c.utilizationRate,
              monthlySpend: c.monthlySpend,
              availableCredit: c.availableCredit
            };
          });
        });
      };
    }]);
})();