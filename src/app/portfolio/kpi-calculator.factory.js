(function() {
  'use strict';
  angular.module('app.portfolio')
    .factory('KpiCalculator', [function() {
      return {
        calculateKpis: function(cards) {
          if (!cards || cards.length === 0) {
            return {
              totalCreditLimit: 0,
              totalAvailableCredit: 0,
              totalOutstanding: 0,
              monthlySpend: 0,
              creditUtilization: 0,
              activeCardCount: 0
            };
          }
          var totalCreditLimit = cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0);
          var totalAvailableCredit = cards.reduce(function(sum, card) { return sum + (card.availableCredit || 0); }, 0);
          var totalOutstanding = cards.reduce(function(sum, card) { return sum + (card.outstandingAmount || 0); }, 0);
          var monthlySpend = cards.reduce(function(sum, card) { return sum + (card.currentBalance || 0); }, 0);
          var activeCardCount = cards.filter(function(card) { return card.status === 'active'; }).length;
          var creditUtilization = totalCreditLimit > 0 ? ((totalCreditLimit - totalAvailableCredit) / totalCreditLimit * 100).toFixed(2) : 0;
          return {
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            monthlySpend: monthlySpend,
            creditUtilization: parseFloat(creditUtilization),
            activeCardCount: activeCardCount
          };
        }
      };
    }]);
})();