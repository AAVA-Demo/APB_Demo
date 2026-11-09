(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('KPIAggregationService', ['$q', 'CreditCardDataService', 'TransactionProcessingService', function($q, CreditCardDataService, TransactionProcessingService) {
      return {
        getAggregatedKPIs: function() {
          return $q.all({
            cards: CreditCardDataService.getCards(),
            transactions: TransactionProcessingService.getTransactionSummary()
          }).then(function(results) {
            var cards = results.cards;
            var transactions = results.transactions;
            var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
            var totalAvailableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
            return {
              monthlySpend: transactions.currentMonthSpend,
              totalCreditLimit: totalCreditLimit,
              availableCredit: totalAvailableCredit,
              outstandingAmount: transactions.totalOutstanding,
              lastUpdated: new Date()
            };
          });
        }
      };
    }]);
})();