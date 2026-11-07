(function() {
  'use strict';
  angular.module('app.dashboard').service('KpiCalculationService', ['CreditCardDataFactory', 'TransactionDataFactory', '$q', function(CreditCardDataFactory, TransactionDataFactory, $q) {
    this.getKPIs = function() {
      var promises = {
        cards: CreditCardDataFactory.getAllCards(),
        transactions: TransactionDataFactory.getCurrentMonthTransactions()
      };
      return $q.all(promises).then(function(results) {
        var cards = results.cards;
        var transactions = results.transactions;
        var totalCreditLimit = 0;
        var totalAvailableCredit = 0;
        var totalOutstanding = 0;
        cards.forEach(function(card) {
          totalCreditLimit += card.creditLimit;
          totalAvailableCredit += card.availableCredit;
          totalOutstanding += card.outstandingAmount;
        });
        var monthlySpend = 0;
        transactions.forEach(function(txn) {
          monthlySpend += txn.amount;
        });
        var creditUtilization = totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(2) : 0;
        return {
          totalCreditLimit: totalCreditLimit,
          totalAvailableCredit: totalAvailableCredit,
          totalOutstanding: totalOutstanding,
          monthlySpend: monthlySpend,
          numberOfCards: cards.length,
          creditUtilization: creditUtilization,
          cards: cards
        };
      });
    };
  }]);
})();