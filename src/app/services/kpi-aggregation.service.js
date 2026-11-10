(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIAggregationService', [function() {
      var self = this;
      self.calculateKPIs = function(cards, transactions) {
        var totalCreditLimit = 0;
        var totalAvailableCredit = 0;
        var totalOutstanding = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit || 0;
          totalAvailableCredit += card.availableCredit || 0;
          totalOutstanding += card.currentBalance || 0;
        });
        var monthlySpend = 0;
        transactions.forEach(function(txn) {
          monthlySpend += txn.amount || 0;
        });
        return {
          totalCreditLimit: Math.round(totalCreditLimit * 100) / 100,
          totalAvailableCredit: Math.round(totalAvailableCredit * 100) / 100,
          totalOutstanding: Math.round(totalOutstanding * 100) / 100,
          monthlySpend: Math.round(monthlySpend * 100) / 100,
          lastUpdated: new Date()
        };
      };
    }]);
})();