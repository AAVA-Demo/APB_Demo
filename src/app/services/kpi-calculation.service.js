(function() {
  'use strict';
  angular.module('cc.dashboard')
    .service('KpiCalculationService', [KpiCalculationService]);
  function KpiCalculationService() {
    this.calculateKpis = function(cards, transactions) {
      var totalCreditLimit = 0;
      var totalOutstanding = 0;
      cards.forEach(function(card) {
        totalCreditLimit += card.creditLimit || 0;
        totalOutstanding += card.outstandingBalance || 0;
      });
      var totalAvailableCredit = totalCreditLimit - totalOutstanding;
      var monthlySpend = 0;
      transactions.forEach(function(transaction) {
        monthlySpend += transaction.amount || 0;
      });
      return {
        monthlySpend: monthlySpend,
        totalCreditLimit: totalCreditLimit,
        totalAvailableCredit: totalAvailableCredit,
        totalOutstanding: totalOutstanding
      };
    };
  }
})();