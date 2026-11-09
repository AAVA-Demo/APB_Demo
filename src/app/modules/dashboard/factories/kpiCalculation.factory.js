(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .factory('KPICalculationFactory', [KPICalculationFactory]);
  function KPICalculationFactory() {
    return {
      calculate: function(cards, monthlyData) {
        var totalCreditLimit = 0;
        var outstandingAmount = 0;
        if (cards && cards.length > 0) {
          cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit || 0;
            outstandingAmount += card.outstandingAmount || 0;
          });
        }
        var monthlySpend = 0;
        if (monthlyData && monthlyData.totalSpend) {
          monthlySpend = monthlyData.totalSpend;
        }
        var availableCredit = totalCreditLimit - outstandingAmount;
        return {
          totalCreditLimit: parseFloat(totalCreditLimit.toFixed(2)),
          availableCredit: parseFloat(availableCredit.toFixed(2)),
          outstandingAmount: parseFloat(outstandingAmount.toFixed(2)),
          monthlySpend: parseFloat(monthlySpend.toFixed(2)),
          lastUpdated: new Date()
        };
      }
    };
  }
})();