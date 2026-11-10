(function() {
  'use strict';
  angular.module('portfolio')
    .factory('CreditCalculationFactory', [function() {
      return {
        calculateAvailableCredit: function(card) {
          return card.totalCreditLimit - card.outstandingAmount;
        }
      };
    }]);
})();