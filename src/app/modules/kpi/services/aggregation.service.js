(function() {
  'use strict';
  angular.module('creditCardApp.kpi').service('AggregationService', [function() {
    var service = this;
    service.aggregateMetrics = function(cardFinancials) {
      if (!cardFinancials || !Array.isArray(cardFinancials)) {
        return {
          totalCreditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0
        };
      }
      var totalCreditLimit = cardFinancials.reduce(function(sum, card) {
        return sum + (card.creditLimit || 0);
      }, 0);
      var availableCredit = cardFinancials.reduce(function(sum, card) {
        return sum + (card.availableCredit || 0);
      }, 0);
      var outstandingAmount = cardFinancials.reduce(function(sum, card) {
        return sum + (card.outstandingBalance || 0);
      }, 0);
      return {
        totalCreditLimit: totalCreditLimit,
        availableCredit: availableCredit,
        outstandingAmount: outstandingAmount
      };
    };
  }]);
})();