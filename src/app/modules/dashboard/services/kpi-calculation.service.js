(function() {
  'use strict';
  angular.module('creditCard.dashboard').service('KPICalculationService', [function() {
    var self = this;
    self.calculateKPIs = function(cardSummaries, monthlySpend) {
      var totalCreditLimit = cardSummaries.reduce(function(sum, card) {
        return sum + card.creditLimit;
      }, 0);
      var outstandingAmount = cardSummaries.reduce(function(sum, card) {
        return sum + card.currentBalance;
      }, 0);
      var availableCredit = totalCreditLimit - outstandingAmount;
      var utilizationPercentage = totalCreditLimit > 0 ? (outstandingAmount / totalCreditLimit * 100).toFixed(2) : 0;
      return {
        monthlySpend: monthlySpend,
        totalCreditLimit: totalCreditLimit,
        availableCredit: availableCredit,
        outstandingAmount: outstandingAmount,
        utilizationPercentage: parseFloat(utilizationPercentage),
        lastUpdated: new Date()
      };
    };
  }]);
})();