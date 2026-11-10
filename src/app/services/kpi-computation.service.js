(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KPIComputationService', [KPIComputationService]);
  function KPIComputationService() {
    var self = this;
    self.computeKPIs = computeKPIs;
    function computeKPIs(cards, transactions) {
      try {
        var totalCreditLimit = cards.reduce(function(sum, card) {
          return sum + (card.creditLimit || 0);
        }, 0);
        var outstandingAmount = cards.reduce(function(sum, card) {
          return sum + (card.outstandingAmount || 0);
        }, 0);
        var monthlySpend = transactions.reduce(function(sum, txn) {
          return sum + (txn.amount || 0);
        }, 0);
        var availableCredit = totalCreditLimit - outstandingAmount;
        return {
          monthlySpend: monthlySpend,
          totalCreditLimit: totalCreditLimit,
          availableCredit: availableCredit,
          outstandingAmount: outstandingAmount
        };
      } catch (error) {
        return {
          monthlySpend: 0,
          totalCreditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0
        };
      }
    }
  }
})();