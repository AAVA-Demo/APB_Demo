(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['CreditCardDataService', 'TransactionService', 'KPIComputationService', '$q', DashboardService]);
  function DashboardService(CreditCardDataService, TransactionService, KPIComputationService, $q) {
    var self = this;
    self.loadKPIs = loadKPIs;
    function loadKPIs() {
      return $q.all([
        CreditCardDataService.getAllCards(),
        TransactionService.getCurrentMonthTransactions()
      ]).then(function(results) {
        var cards = results[0];
        var transactions = results[1];
        return KPIComputationService.computeKPIs(cards, transactions);
      });
    }
  }
})();