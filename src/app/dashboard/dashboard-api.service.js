(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('DashboardApiService', ['$q', 'CreditCardService', 'TransactionService', 'KpiCalculationService', function($q, CreditCardService, TransactionService, KpiCalculationService) {
      this.fetchDashboardData = function() {
        return $q.all({
          cards: CreditCardService.getAllCards(),
          transactions: TransactionService.getCurrentMonthTransactions()
        }).then(function(results) {
          return KpiCalculationService.computeKPIs(results.cards, results.transactions);
        });
      };
    }]);
})();