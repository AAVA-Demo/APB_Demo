(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .service('dashboardOrchestrationService', ['$q', 'creditCardDataService', 'transactionProcessingService', 'cacheService', 'kpiCalculationFactory', function($q, creditCardDataService, transactionProcessingService, cacheService, kpiCalculationFactory) {
      var self = this;
      self.getKPIs = function() {
        var cached = cacheService.get('kpiData');
        if (cached) {
          return $q.resolve(cached);
        }
        return $q.all({
          cards: creditCardDataService.getAllCards(),
          transactions: transactionProcessingService.getMonthlyTransactions()
        }).then(function(results) {
          var kpis = kpiCalculationFactory.calculate(results.cards, results.transactions);
          cacheService.put('kpiData', kpis, 120);
          return kpis;
        });
      };
    }]);
})();