(function() {
  'use strict';
  angular
    .module('creditCardDashboardModule')
    .service('kpiCalculationService', ['$filter', kpiCalculationService]);

  function kpiCalculationService($filter) {
    this.calculateKPIs = function(cards, transactions) {
      var now = new Date();
      var currentMonth = now.getMonth();
      var currentYear = now.getFullYear();
      var monthlyTransactions = transactions.filter(function(t) {
        var tDate = new Date(t.transactionDate);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });
      var totalMonthlySpend = monthlyTransactions.reduce(function(sum, t) {
        return sum + t.amount;
      }, 0);
      var totalCreditLimit = cards.reduce(function(sum, c) {
        return sum + c.creditLimit;
      }, 0);
      var totalOutstandingAmount = cards.reduce(function(sum, c) {
        return sum + c.outstandingAmount;
      }, 0);
      var totalAvailableCredit = cards.reduce(function(sum, c) {
        return sum + c.availableCredit;
      }, 0);
      return {
        totalMonthlySpend: totalMonthlySpend,
        totalCreditLimit: totalCreditLimit,
        totalAvailableCredit: totalAvailableCredit,
        totalOutstandingAmount: totalOutstandingAmount,
        cardCount: cards.length,
        cards: cards
      };
    };
  }
})();