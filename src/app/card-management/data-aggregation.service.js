(function() {
  'use strict';
  angular.module('cardManagementModule')
    .factory('DataAggregationService', ['$q', 'CardDataService', 'SpendingCalculationService', function($q, CardDataService, SpendingCalculationService) {
      return {
        getAggregatedCardData: function(userId) {
          return CardDataService.getCards(userId).then(function(cards) {
            var promises = cards.map(function(card) {
              return SpendingCalculationService.calculateSpending(card.cardId).then(function(spending) {
                card.spending = spending;
                return card;
              });
            });
            return $q.all(promises).then(function(enrichedCards) {
              var totalCreditLimit = enrichedCards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
              var totalAvailableCredit = enrichedCards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
              var totalOutstanding = enrichedCards.reduce(function(sum, card) { return sum + card.currentBalance; }, 0);
              var avgUtilization = totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(1) : 0;
              return {
                cards: enrichedCards,
                totalCreditLimit: totalCreditLimit,
                totalAvailableCredit: totalAvailableCredit,
                totalOutstanding: totalOutstanding,
                averageUtilization: avgUtilization
              };
            });
          });
        }
      };
    }]);
})();