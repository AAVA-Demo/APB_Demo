(function() {
  'use strict';
  angular.module('creditCardApp').factory('KPICalculator', [function() {
    return {
      aggregate: function(cards, monthlySpend) {
        var totalCreditLimit = 0;
        var totalOutstanding = 0;
        var totalAvailableCredit = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          totalOutstanding += card.outstandingAmount || 0;
          totalAvailableCredit += card.availableCredit || 0;
        });
        var creditUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit * 100) : 0;
        return {
          monthlySpend: monthlySpend,
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          creditUtilization: creditUtilization
        };
      }
    };
  }]);
})();