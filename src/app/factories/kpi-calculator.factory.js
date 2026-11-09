(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPICalculator', [function() {
      return {
        calculate: function(cards, summary) {
          var totalCreditLimit = 0;
          var totalOutstanding = 0;
          var totalAvailableCredit = 0;
          if (cards && cards.length > 0) {
            cards.forEach(function(card) {
              totalCreditLimit += card.creditLimit || 0;
              totalOutstanding += card.outstandingAmount || 0;
              totalAvailableCredit += card.availableCredit || 0;
            });
          }
          var creditUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit * 100).toFixed(2) : 0;
          var monthlySpend = summary && summary.monthlySpend ? summary.monthlySpend : 0;
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