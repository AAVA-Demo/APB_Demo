(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardAggregationService', ['CreditCardDataFactory', 'TransactionProcessingFactory', 'KPICalculationService', '$q', function(CreditCardDataFactory, TransactionProcessingFactory, KPICalculationService, $q) {
      const self = this;
      self.fetchKPIs = function() {
        return $q.all([
          CreditCardDataFactory.getAllCards(),
          TransactionProcessingFactory.getMonthlySpend()
        ]).then(function(results) {
          const cards = results[0];
          const spend = results[1];
          return KPICalculationService.calculateKPIs(cards, spend);
        });
      };
    }]);
})();