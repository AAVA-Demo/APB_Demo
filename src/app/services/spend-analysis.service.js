(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('SpendAnalysisService', ['CreditCardDataFactory', function(CreditCardDataFactory) {
      this.getMonthlyTrends = function(cardId) {
        return CreditCardDataFactory.fetchTransactions(cardId);
      };
      this.calculateUtilization = function(card) {
        return ((card.outstandingAmount / card.creditLimit) * 100).toFixed(2);
      };
    }]);
})();