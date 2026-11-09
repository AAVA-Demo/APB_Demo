(function() {
  'use strict';
  angular.module('creditCardApp').factory('spendAnalysisFactory', [function() {
    return {
      calculateSpendAnalysis: function(cards) {
        return cards.map(function(card) {
          const utilization = card.creditLimit > 0 ? (card.balance / card.creditLimit * 100).toFixed(2) : 0;
          return Object.assign({}, card, {
            utilizationPercent: parseFloat(utilization),
            metadata: card.metadata || {}
          });
        });
      },
      compareCards: function(cards) {
        const sorted = cards.slice().sort(function(a, b) {
          return b.monthlySpend - a.monthlySpend;
        });
        return sorted.map(function(card, index) {
          return Object.assign({}, card, {rank: index + 1});
        });
      }
    };
  }]);
})();