(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardComparisonFactory', [function() {
      return {
        compareCards: function(cards) {
          if (!cards || cards.length === 0) return [];
          var sorted = cards.slice().sort(function(a, b) {
            return b.monthlySpend - a.monthlySpend;
          });
          return sorted.map(function(card, index) {
            return {
              cardId: card.cardId,
              rank: index + 1,
              monthlySpend: card.monthlySpend,
              utilizationRate: card.utilizationRate,
              recommendation: card.utilizationRate > 70 ? 'High utilization - consider paying down balance' : 'Healthy utilization'
            };
          });
        },
        getBestCard: function(cards, category) {
          if (!cards || cards.length === 0) return null;
          return cards.reduce(function(best, card) {
            return (card.monthlySpend > best.monthlySpend) ? card : best;
          });
        }
      };
    }]);
})();