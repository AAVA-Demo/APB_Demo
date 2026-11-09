(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['CreditCardFactory', 'TransactionFactory', '$q', function(CreditCardFactory, TransactionFactory, $q) {
      var service = {
        getKPIs: getKPIs
      };
      return service;
      function getKPIs() {
        var promises = {
          cards: CreditCardFactory.getAllCards(),
          monthlySpend: TransactionFactory.getMonthlySpend()
        };
        return $q.all(promises)
          .then(function(results) {
            var cards = results.cards;
            var monthlySpend = results.monthlySpend;
            var totalCreditLimit = 0;
            var outstandingAmount = 0;
            cards.forEach(function(card) {
              totalCreditLimit += card.creditLimit || 0;
              outstandingAmount += card.outstandingAmount || 0;
            });
            var availableCredit = totalCreditLimit - outstandingAmount;
            return {
              monthlySpend: monthlySpend,
              totalCreditLimit: totalCreditLimit,
              availableCredit: availableCredit,
              outstandingAmount: outstandingAmount,
              lastUpdated: new Date()
            };
          });
      }
    }]);
})();