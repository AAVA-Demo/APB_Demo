(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardComparisonService', ['CardDataService', function(CardDataService) {
      this.calculateComparison = function(cards) {
        if (!cards || cards.length === 0) {
          return {
            cards: [],
            totalSpend: 0,
            averageUtilization: 0,
            highestSpendCard: null,
            lowestUtilizationCard: null
          };
        }
        var totalSpend = 0;
        var totalUtilization = 0;
        var highestSpendCard = cards[0];
        var lowestUtilizationCard = cards[0];
        angular.forEach(cards, function(card) {
          totalSpend += card.monthlySpend || 0;
          totalUtilization += card.utilizationRate || 0;
          if ((card.monthlySpend || 0) > (highestSpendCard.monthlySpend || 0)) {
            highestSpendCard = card;
          }
          if ((card.utilizationRate || 0) < (lowestUtilizationCard.utilizationRate || 0)) {
            lowestUtilizationCard = card;
          }
        });
        return {
          cards: cards,
          totalSpend: totalSpend,
          averageUtilization: (totalUtilization / cards.length).toFixed(2),
          highestSpendCard: highestSpendCard,
          lowestUtilizationCard: lowestUtilizationCard
        };
      };
    }]);
})();