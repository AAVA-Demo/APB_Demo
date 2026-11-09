(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('KPICalculatorFactory', [function() {
      return {
        calculateKPIs: function(cards) {
          if (!cards || cards.length === 0) {
            return {
              totalCreditLimit: 0,
              totalAvailableCredit: 0,
              totalOutstanding: 0,
              totalMonthlySpend: 0,
              creditUtilizationPercent: 0,
              activeCardsCount: 0
            };
          }
          var totalCreditLimit = 0;
          var totalAvailableCredit = 0;
          var totalOutstanding = 0;
          var totalMonthlySpend = 0;
          var activeCardsCount = 0;
          cards.forEach(function(card) {
            if (card.status === 'Active') {
              activeCardsCount++;
            }
            totalCreditLimit += card.creditLimit || 0;
            totalAvailableCredit += card.availableCredit || 0;
            totalOutstanding += card.outstandingAmount || 0;
            totalMonthlySpend += card.monthlySpend || 0;
          });
          var creditUtilizationPercent = totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(2) : 0;
          return {
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            totalMonthlySpend: totalMonthlySpend,
            creditUtilizationPercent: parseFloat(creditUtilizationPercent),
            activeCardsCount: activeCardsCount
          };
        }
      };
    }]);
})();