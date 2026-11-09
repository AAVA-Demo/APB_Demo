(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPICalculationService', ['CreditCardDataService', 'TransactionService', '$q', function(CreditCardDataService, TransactionService, $q) {
      this.calculateKPIs = function(userId) {
        var promises = {
          cards: CreditCardDataService.getCardBalances(userId),
          transactions: TransactionService.getMonthlyTransactions(userId)
        };
        return $q.all(promises).then(function(results) {
          var cards = results.cards;
          var transactions = results.transactions;
          var totalCreditLimit = cards.reduce(function(sum, c) { return sum + c.creditLimit; }, 0);
          var availableCredit = cards.reduce(function(sum, c) { return sum + c.availableCredit; }, 0);
          var outstandingAmount = cards.reduce(function(sum, c) { return sum + (c.currentBalance || 0); }, 0);
          var monthlySpend = transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            creditUtilization: totalCreditLimit > 0 ? ((totalCreditLimit - availableCredit) / totalCreditLimit * 100).toFixed(2) : 0,
            timestamp: new Date()
          };
        });
      };
      this.getKPIs = function(userId) {
        return this.calculateKPIs(userId);
      };
    }]);
})();