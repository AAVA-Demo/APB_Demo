(function() {
  'use strict';
  angular.module('creditCardApp').factory('kpiCalculationFactory', [function() {
    return {
      calculateKPIs: function(cardData, transactionData) {
        let totalCreditLimit = 0;
        let availableCredit = 0;
        cardData.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          availableCredit += card.availableCredit || 0;
        });
        return {
          monthlySpend: transactionData.monthlySpend || 0,
          totalCreditLimit: totalCreditLimit,
          availableCredit: availableCredit,
          outstandingAmount: transactionData.outstandingAmount || 0,
          cards: cardData
        };
      }
    };
  }]);
})();