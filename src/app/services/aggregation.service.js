(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AggregationService', [function() {
      this.aggregate = function(cards) {
        var kpis = {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          totalMonthlySpend: 0,
          cards: cards
        };
        cards.forEach(function(card) {
          kpis.totalCreditLimit += card.creditLimit || 0;
          kpis.totalAvailableCredit += card.availableCredit || 0;
          kpis.totalOutstanding += card.outstandingAmount || 0;
          kpis.totalMonthlySpend += card.monthlySpend || 0;
        });
        return kpis;
      };
    }]);
})();