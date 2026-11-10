(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .factory('kpiCalculationFactory', function() {
      return {
        calculate: function(cards, transactions) {
          var totalCreditLimit = 0;
          var totalOutstanding = 0;
          var monthlySpend = 0;
          cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit || 0;
            totalOutstanding += card.currentBalance || 0;
          });
          transactions.forEach(function(txn) {
            monthlySpend += txn.amount || 0;
          });
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: totalCreditLimit - totalOutstanding,
            outstandingAmount: totalOutstanding,
            lastUpdated: new Date()
          };
        }
      };
    });
})();