(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('kpiService', [function() {
      this.calculateKPIs = function(cards) {
        if (!cards || cards.length === 0) {
          return {totalCreditLimit: 0, totalAvailableCredit: 0, totalOutstanding: 0, totalMonthlySpend: 0, cardCount: 0};
        }
        return {
          totalCreditLimit: cards.reduce(function(sum, c) { return sum + c.creditLimit; }, 0),
          totalAvailableCredit: cards.reduce(function(sum, c) { return sum + c.availableCredit; }, 0),
          totalOutstanding: cards.reduce(function(sum, c) { return sum + c.outstandingAmount; }, 0),
          totalMonthlySpend: cards.reduce(function(sum, c) { return sum + c.monthlySpend; }, 0),
          cardCount: cards.length
        };
      };
    }]);