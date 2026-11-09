(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('KpiService', ['$q', 'CreditCardApiService', function($q, CreditCardApiService) {
      this.getKpis = function(userId) {
        return CreditCardApiService.fetchAllCards(userId).then(function(cards) {
          var totalCreditLimit = 0;
          var availableCredit = 0;
          var outstandingAmount = 0;
          var monthlySpend = 0;
          var currentMonth = new Date().getMonth();
          var currentYear = new Date().getFullYear();
          cards.forEach(function(card) {
            totalCreditLimit += card.creditLimit || 0;
            availableCredit += card.availableCredit || 0;
            outstandingAmount += card.outstandingAmount || 0;
            if (card.transactions) {
              card.transactions.forEach(function(txn) {
                var txnDate = new Date(txn.date);
                if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
                  monthlySpend += txn.amount || 0;
                }
              });
            }
          });
          return {
            monthlySpend: monthlySpend,
            totalCreditLimit: totalCreditLimit,
            availableCredit: availableCredit,
            outstandingAmount: outstandingAmount,
            lastRefreshed: new Date()
          };
        });
      };
    }]);
})();