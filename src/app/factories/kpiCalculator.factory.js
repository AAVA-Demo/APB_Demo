(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPICalculatorFactory', [function() {
      return {
        calculateKPIs: function(cards, transactions) {
          var totalCreditLimit = 0;
          var totalOutstanding = 0;
          var totalAvailableCredit = 0;
          cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit;
            totalOutstanding += card.outstandingAmount;
            totalAvailableCredit += card.availableCredit;
          });
          var currentMonth = new Date();
          currentMonth.setDate(1);
          currentMonth.setHours(0, 0, 0, 0);
          var monthlySpend = transactions.filter(function(t) {
            var tDate = new Date(t.date);
            return tDate >= currentMonth;
          }).reduce(function(sum, t) {
            return sum + t.amount;
          }, 0);
          var creditUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit * 100).toFixed(2) : 0;
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstanding: totalOutstanding,
            creditUtilization: parseFloat(creditUtilization)
          };
        }
      };
    }]);
})();