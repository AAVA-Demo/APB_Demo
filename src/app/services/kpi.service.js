(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPIService', ['CreditCardDataService', 'TransactionDataService', '$q', KPIService]);
  function KPIService(CreditCardDataService, TransactionDataService, $q) {
    var service = {
      getKPIs: getKPIs
    };
    return service;
    function getKPIs() {
      var deferred = $q.defer();
      $q.all([
        CreditCardDataService.getCards(),
        TransactionDataService.getTransactions()
      ]).then(function(results) {
        var cards = results[0];
        var transactions = results[1];
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getFullYear();
        var monthlyTransactions = transactions.filter(function(txn) {
          var txnDate = new Date(txn.date);
          return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
        });
        var monthlySpend = monthlyTransactions.reduce(function(sum, txn) {
          return sum + txn.amount;
        }, 0);
        var totalCreditLimit = cards.reduce(function(sum, card) {
          return sum + card.creditLimit;
        }, 0);
        var availableCredit = cards.reduce(function(sum, card) {
          return sum + card.availableCredit;
        }, 0);
        var outstandingAmount = cards.reduce(function(sum, card) {
          return sum + card.currentBalance;
        }, 0);
        var kpis = {
          monthlySpend: monthlySpend,
          totalCreditLimit: totalCreditLimit,
          availableCredit: availableCredit,
          outstandingAmount: outstandingAmount,
          cards: cards
        };
        deferred.resolve(kpis);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }
})();