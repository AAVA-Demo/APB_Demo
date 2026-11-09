(function() {
  'use strict';
  angular.module('creditCard.multiCard').service('CardComparisonService', [function() {
    var self = this;
    self.calculateUtilization = function(card) {
      if (card.creditLimit === 0) return 0;
      return ((card.outstandingBalance / card.creditLimit) * 100).toFixed(2);
    };
    self.compareCards = function(selectedCards) {
      if (!selectedCards || selectedCards.length < 2) {
        return {error: 'Select at least 2 cards for comparison'};
      }
      var comparison = selectedCards.map(function(card) {
        return {
          cardId: card.cardId,
          cardNumber: card.cardNumber,
          creditLimit: card.creditLimit,
          outstandingBalance: card.outstandingBalance,
          availableCredit: card.availableCredit,
          utilizationRate: card.utilizationRate,
          monthlySpend: card.monthlySpend
        };
      });
      var avgUtilization = comparison.reduce(function(sum, c) {
        return sum + parseFloat(c.utilizationRate);
      }, 0) / comparison.length;
      var totalSpend = comparison.reduce(function(sum, c) {
        return sum + c.monthlySpend;
      }, 0);
      return {
        cards: comparison,
        avgUtilization: avgUtilization.toFixed(2),
        totalSpend: totalSpend
      };
    };
  }]);
})();