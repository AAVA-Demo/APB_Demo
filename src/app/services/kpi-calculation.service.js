(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('KPICalculationService', ['$q', 'CreditCardDataFactory', 'TransactionFactory', function($q, CreditCardDataFactory, TransactionFactory) {
      var self = this;
      self.calculateKPIs = function() {
        var deferred = $q.defer();
        $q.all({
          cards: CreditCardDataFactory.getAllCards(),
          transactions: TransactionFactory.getMonthlyTransactions()
        }).then(function(results) {
          var cards = results.cards;
          var transactionData = results.transactions;
          var totalCreditLimit = cards.reduce(function(sum, card) { return sum + card.creditLimit; }, 0);
          var totalOutstanding = cards.reduce(function(sum, card) { return sum + card.currentBalance; }, 0);
          var availableCredit = totalCreditLimit - totalOutstanding;
          var creditUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit * 100).toFixed(2) : 0;
          var kpis = {
            monthlySpend: transactionData.monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: totalOutstanding,
            creditUtilization: creditUtilization,
            lastUpdated: new Date()
          };
          deferred.resolve(kpis);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();