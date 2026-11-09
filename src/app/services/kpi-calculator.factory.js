(function() {
  'use strict';
  angular.module('creditCardApp').factory('KPICalculatorFactory', [KPICalculatorFactory]);
  function KPICalculatorFactory() {
    return {
      calculateKPIs: calculateKPIs
    };
    function calculateKPIs(cards, transactions) {
      var totalCreditLimit = 0;
      var totalAvailableCredit = 0;
      var totalOutstanding = 0;
      if (cards && cards.length > 0) {
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          totalAvailableCredit += card.availableCredit || 0;
          totalOutstanding += card.currentBalance || 0;
        });
      }
      var monthlySpend = 0;
      if (transactions && transactions.length > 0) {
        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();
        transactions.forEach(function(txn) {
          var txnDate = new Date(txn.date);
          if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
            monthlySpend += txn.amount || 0;
          }
        });
      }
      return {
        monthlySpend: monthlySpend,
        totalCreditLimit: totalCreditLimit,
        totalAvailableCredit: totalAvailableCredit,
        totalOutstanding: totalOutstanding,
        lastUpdated: new Date()
      };
    }
  }
})();