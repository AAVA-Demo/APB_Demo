(function() {
  'use strict';
  angular.module('creditCard.management')
    .service('CardComparisonService', ['CardService', '$filter', CardComparisonService]);
  function CardComparisonService(CardService, $filter) {
    const service = {
      compareCards: compareCards
    };
    return service;
    function compareCards(cards) {
      const totalCreditLimit = cards.reduce(function(sum, c) { return sum + c.creditLimit; }, 0);
      const totalAvailableCredit = cards.reduce(function(sum, c) { return sum + c.availableCredit; }, 0);
      const totalOutstanding = cards.reduce(function(sum, c) { return sum + c.outstandingBalance; }, 0);
      const averageUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0;
      return {
        cards: cards,
        metrics: {
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          averageUtilization: averageUtilization
        }
      };
    }
  }
})();