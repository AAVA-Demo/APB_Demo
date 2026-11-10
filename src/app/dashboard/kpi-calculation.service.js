(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('KpiCalculationService', [function() {
      this.computeKPIs = function(cards, transactions) {
        try {
          const monthlySpend = transactions.reduce((sum, txn) => sum + txn.amount, 0);
          const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
          const outstandingAmount = cards.reduce((sum, card) => sum + card.outstandingBalance, 0);
          const availableCredit = totalCreditLimit - outstandingAmount;
          return {
            monthlySpend: Number(monthlySpend.toFixed(2)),
            totalCreditLimit: Number(totalCreditLimit.toFixed(2)),
            availableCredit: Number(availableCredit.toFixed(2)),
            outstandingAmount: Number(outstandingAmount.toFixed(2))
          };
        } catch (error) {
          return {
            monthlySpend: 0.00,
            totalCreditLimit: 0.00,
            availableCredit: 0.00,
            outstandingAmount: 0.00
          };
        }
      };
    }]);
})();