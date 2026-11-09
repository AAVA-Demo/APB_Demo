(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPICalculator', [function() {
      var service = {
        compute: compute
      };
      return service;

      function compute(cards, transactions) {
        var kpi = {
          monthlySpend: 0,
          totalCreditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0,
          lastUpdated: new Date()
        };
        if (cards && cards.length > 0) {
          cards.forEach(function(card) {
            kpi.totalCreditLimit += card.creditLimit || 0;
            kpi.availableCredit += card.availableCredit || 0;
            kpi.outstandingAmount += card.currentBalance || 0;
          });
        }
        if (transactions && transactions.length > 0) {
          transactions.forEach(function(txn) {
            kpi.monthlySpend += txn.amount || 0;
          });
        }
        return kpi;
      }
    }]);
})();