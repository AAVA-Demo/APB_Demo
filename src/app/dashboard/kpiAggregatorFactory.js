(function() {
  'use strict';
  angular.module('creditCardApp').factory('kpiAggregatorFactory', [function() {
    return {
      aggregate: function(cardData, txnData, balData) {
        var totalCreditLimit = 0;
        var availableCredit = 0;
        var outstandingAmount = 0;
        if (cardData && cardData.cards) {
          cardData.cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit || 0;
            availableCredit += card.availableCredit || 0;
            outstandingAmount += card.outstandingBalance || 0;
          });
        }
        var monthlySpend = txnData && txnData.monthlySpend ? txnData.monthlySpend : 0;
        return {
          monthlySpend: parseFloat(monthlySpend.toFixed(2)),
          totalCreditLimit: parseFloat(totalCreditLimit.toFixed(2)),
          availableCredit: parseFloat(availableCredit.toFixed(2)),
          outstandingAmount: parseFloat(outstandingAmount.toFixed(2)),
          lastUpdated: new Date()
        };
      }
    };
  }]);
})();