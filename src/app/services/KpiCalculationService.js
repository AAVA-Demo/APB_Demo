(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KpiCalculationService', [function() {
      return {
        calculateKPIs: function(cards) {
          var monthlySpend = cards.reduce(function(sum, card) { return sum + card.monthlySpend; }, 0);
          var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
          var availableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
          var outstandingAmount = cards.reduce(function(sum, card) { return sum + card.outstandingBalance; }, 0);
          var creditUtilization = totalCreditLimit > 0 ? ((outstandingAmount / totalCreditLimit) * 100).toFixed(2) : 0;
          return {
            userId: cards.length > 0 ? cards[0].userId : '',
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            creditUtilization: creditUtilization,
            lastUpdated: new Date().toISOString()
          };
        }
      };
    }]);
})();