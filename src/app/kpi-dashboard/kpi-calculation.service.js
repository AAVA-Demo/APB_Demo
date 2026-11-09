(function() {
  'use strict';
  angular.module('kpiDashboardModule')
    .factory('KPICalculationService', ['$q', 'CreditCardDataService', 'TransactionService', function($q, CreditCardDataService, TransactionService) {
      return {
        calculateKPIs: function() {
          return $q.all({
            cards: CreditCardDataService.getCards(),
            transactions: TransactionService.getTransactionSummary()
          }).then(function(results) {
            var cards = results.cards;
            var transactions = results.transactions;
            var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
            var totalAvailableCredit = cards.reduce(function(sum, card) { return sum + card.availableCredit; }, 0);
            return {
              monthlySpend: { label: 'Monthly Spend', value: transactions.currentMonthSpend, trend: 'up' },
              totalCreditLimit: { label: 'Total Credit Limit', value: totalCreditLimit },
              availableCredit: { label: 'Available Credit', value: totalAvailableCredit, percentage: (totalAvailableCredit / totalCreditLimit * 100).toFixed(1) },
              outstandingAmount: { label: 'Outstanding Amount', value: transactions.totalOutstanding }
            };
          });
        }
      };
    }]);
})();