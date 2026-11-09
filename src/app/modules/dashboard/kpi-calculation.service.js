(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('KpiCalculationService', ['$filter', function($filter) {
      this.calculateKpis = function(rawData) {
        if (!rawData || !rawData.cards) {
          return {
            monthlySpend: 0,
            totalCreditLimit: 0,
            availableCredit: 0,
            outstandingAmount: 0,
            lastUpdated: new Date()
          };
        }
        var totalLimit = 0;
        var totalAvailable = 0;
        var totalOutstanding = 0;
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getFullYear();
        var monthlySpend = 0;
        rawData.cards.forEach(function(card) {
          totalLimit += card.creditLimit || 0;
          totalAvailable += card.availableCredit || 0;
          totalOutstanding += card.outstandingAmount || 0;
        });
        if (rawData.transactions) {
          rawData.transactions.forEach(function(txn) {
            var txnDate = new Date(txn.transactionDate);
            if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
              monthlySpend += txn.amount || 0;
            }
          });
        }
        return {
          userId: rawData.userId,
          monthlySpend: monthlySpend,
          totalCreditLimit: totalLimit,
          availableCredit: totalAvailable,
          outstandingAmount: totalOutstanding,
          lastUpdated: new Date()
        };
      };
    }]);
})();