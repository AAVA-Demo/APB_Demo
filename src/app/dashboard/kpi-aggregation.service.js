(function() {
  'use strict';
  angular.module('dashboardModule').service('KpiAggregationService', ['CreditCardDataFactory', 'TransactionProcessingFactory', 'CacheService', '$q', function(CreditCardDataFactory, TransactionProcessingFactory, CacheService, $q) {
    var self = this;
    self.getKpis = function() {
      var cached = CacheService.get('kpiData');
      if (cached) {
        return $q.resolve(cached);
      }
      return $q.all({
        cardSummary: CreditCardDataFactory.getSummary(),
        transactionSummary: TransactionProcessingFactory.getMonthlySummary()
      }).then(function(results) {
        var kpiData = {
          monthlySpend: results.transactionSummary.monthlySpend || 0,
          totalCreditLimit: results.cardSummary.totalCreditLimit || 0,
          availableCredit: results.cardSummary.totalAvailableCredit || 0,
          outstandingAmount: results.transactionSummary.outstandingAmount || 0,
          lastUpdated: new Date()
        };
        CacheService.put('kpiData', kpiData, 60);
        return kpiData;
      });
    };
  }]);
})();