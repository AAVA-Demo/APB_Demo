(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .factory('FinancialAggregationService', [function() {
      function aggregateKPIs(cards) {
        if (!cards || cards.length === 0) {
          return {
            totalMonthlySpend: 0,
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstanding: 0,
            creditUtilization: 0
          };
        }
        var totalMonthlySpend = 0;
        var totalCreditLimit = 0;
        var totalAvailableCredit = 0;
        var totalOutstanding = 0;
        cards.forEach(function(card) {
          totalMonthlySpend += card.monthlySpend || 0;
          totalCreditLimit += card.creditLimit || 0;
          totalAvailableCredit += card.availableCredit || 0;
          totalOutstanding += card.outstandingAmount || 0;
        });
        var creditUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0;
        return {
          totalMonthlySpend: totalMonthlySpend,
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          creditUtilization: creditUtilization
        };
      }
      return {
        aggregateKPIs: aggregateKPIs
      };
    }]);
})();