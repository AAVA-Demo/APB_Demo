(function(window) {
  'use strict';
  class KPICalculator {
    calculateKPIs(cards) {
      if (!cards || cards.length === 0) {
        return {
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstandingAmount: 0,
          totalMonthlySpend: 0,
          cards: []
        };
      }
      var totalCreditLimit = 0;
      var totalAvailableCredit = 0;
      var totalOutstandingAmount = 0;
      var totalMonthlySpend = 0;
      cards.forEach(function(card) {
        totalCreditLimit += card.creditLimit || 0;
        totalAvailableCredit += card.availableCredit || 0;
        totalOutstandingAmount += card.outstandingAmount || 0;
        totalMonthlySpend += card.monthlySpend || 0;
      });
      return {
        totalCreditLimit: totalCreditLimit,
        totalAvailableCredit: totalAvailableCredit,
        totalOutstandingAmount: totalOutstandingAmount,
        totalMonthlySpend: totalMonthlySpend,
        cards: cards
      };
    }
  }
  window.KPICalculator = KPICalculator;
})(window);