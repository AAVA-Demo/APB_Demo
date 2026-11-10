(function() {
  'use strict';
  angular.module('dashboardModule').service('KPIService', [function() {
    this.calculateKPIs = function(cards) {
      if (!cards || cards.length === 0) {
        return {
          totalCreditLimit: 0,
          totalOutstanding: 0,
          totalAvailableCredit: 0,
          overallUtilization: 0,
          totalMonthlySpend: 0,
          cardCount: 0
        };
      }
      var totalCreditLimit = 0;
      var totalOutstanding = 0;
      var totalAvailableCredit = 0;
      var totalMonthlySpend = 0;
      cards.forEach(function(card) {
        totalCreditLimit += card.creditLimit || 0;
        totalOutstanding += card.outstandingAmount || 0;
        totalAvailableCredit += card.availableCredit || 0;
        totalMonthlySpend += card.monthlySpend || 0;
      });
      var overallUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit * 100).toFixed(2) : 0;
      return {
        totalCreditLimit: totalCreditLimit,
        totalOutstanding: totalOutstanding,
        totalAvailableCredit: totalAvailableCredit,
        overallUtilization: parseFloat(overallUtilization),
        totalMonthlySpend: totalMonthlySpend,
        cardCount: cards.length
      };
    };
  }]);
})();