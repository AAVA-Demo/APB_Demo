(function() {
  'use strict';
  angular.module('dashboard')
    .service('DashboardService', ['CreditCardAPIFactory', '$q', function(CreditCardAPIFactory, $q) {
      var self = this;
      self.getKPIs = function(userId) {
        return CreditCardAPIFactory.getAllCardsSummary(userId)
          .then(function(cards) {
            var kpis = {
              userId: userId,
              monthlySpend: 0,
              totalCreditLimit: 0,
              availableCredit: 0,
              outstandingAmount: 0,
              lastUpdated: new Date()
            };
            angular.forEach(cards, function(card) {
              kpis.monthlySpend += card.monthlySpend || 0;
              kpis.totalCreditLimit += card.creditLimit || 0;
              kpis.availableCredit += card.availableCredit || 0;
              kpis.outstandingAmount += card.outstandingBalance || 0;
            });
            return kpis;
          });
      };
    }]);
})();