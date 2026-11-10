(function() {
  'use strict';
  angular.module('dashboard')
    .service('KpiCalculationService', ['CreditCardDataFactory', '$q', function(CreditCardDataFactory, $q) {
      this.getKpiSummary = function() {
        return CreditCardDataFactory.getAllCards().then(function(cards) {
          return this.aggregateCardData(cards);
        }.bind(this));
      };
      this.aggregateCardData = function(cards) {
        var summary = {
          totalMonthlySpend: 0,
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          cardCount: cards.length
        };
        cards.forEach(function(card) {
          summary.totalMonthlySpend += card.monthlySpend || 0;
          summary.totalCreditLimit += card.creditLimit || 0;
          summary.totalAvailableCredit += card.availableCredit || 0;
          summary.totalOutstanding += card.outstandingAmount || 0;
        });
        return summary;
      };
    }]);
})();